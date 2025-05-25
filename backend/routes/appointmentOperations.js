const { Request, TYPES } = require("tedious");
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

const getNextAppointmentId = (connection, callback) => {
  const request = new Request(
    "SELECT MAX(ID_Cita) AS maxId FROM Cita",
    (err) => {
      if (err) return callback(err);
    }
  );

  let maxId = 0;
  request.on("row", (columns) => {
    maxId = columns[0].value || 0;
  });

  request.on("requestCompleted", () => {
    callback(null, maxId + 1);
  });

  connection.execSql(request);
};

router.get("/getAppointments", (req, res) => {
  const patientId = parseInt(req.query.patientId);
  if (!patientId) {
    return res.status(400).json({ error: "Se requiere patientId válido" });
  }

  const connection = db();
  const results = [];

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    const query = `SELECT * FROM Cita WHERE ID_Paciente = @patientId`;
    const request = new Request(query, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al ejecutar la consulta",
          detail: err.message,
        });
      }
    });

    request.addParameter("patientId", TYPES.Int, patientId);

    request.on("row", (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      results.push(row);
    });

    request.on("requestCompleted", () => {
      res.json(results);
      connection.close();
    });

    connection.execSql(request);
  });

  connection.connect();
});

router.post("/newAppointment", (req, res) => {
  const { patientId, medicId, assistantId, date } = req.body;
  const query = `INSERT INTO Cita (ID_Paciente,ID_Medico,ID_Asistente,fecha,estado) VALUES (@patientId, @medicId, @assistantId, @date, @status)`;
  const request = new Request(query, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al ejecutar la consulta", detail: err });
    } else {
      res.status(200).json({ message: "Datos insertados correctamente." });
    }
  });

  request.addParameter("patientId", TYPES.Int, patientId);
  request.addParameter("medicId", TYPES.Int, medicId);
  request.addParameter("assistantId", assistantId);
  request.addParameter("date", date);
  request.addParameter("status", "pendiente");

  request.on("row", (columns) => {
    const row = {};
    columns.forEach((column) => {
      row[column.metadata.colName] = column.value;
    });
  });

  request.on("requestCompleted", () => {
    res.json(results);
  });
});

router.post("/cancelAppointment", (req, res) => {
  const { appointmentId } = req.body;
  
  if (!appointmentId) {
    return res.status(400).json({ error: "Se requiere appointmentId" });
  }

  const query = `
    UPDATE Cita 
    SET estado = 'cancelada'
    WHERE ID_Cita = @appointmentId
    AND estado != 'cancelada'
  `;
  
  const request = new Request(query, (err) => {
    if (err) {
      return res.status(500).json({ 
        error: "Error al cancelar cita", 
        detail: err.message 
      });
    }
  });

  request.addParameter("appointmentId", TYPES.Int, appointmentId);

  let results = [];
  request.on("row", (columns) => {
    const row = {};
    columns.forEach((column) => {
      row[column.metadata.colName] = column.value;
    });
    results.push(row);
  });

  request.on("requestCompleted", () => {
    if (results.length === 0) {
      return res.status(404).json({ 
        error: "Cita no encontrada o ya estaba cancelada" 
      });
    }
    res.json({ 
      message: "Cita cancelada exitosamente",
      cita: results[0] 
    });
  });

  connection.execSql(request);
});
module.exports = { router };
 
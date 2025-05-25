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
  if (!patientId || !medicId || !assistantId || !date) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const connection = db();

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    getNextAppointmentId(connection, (err, newId) => {
      if (err) {
        connection.close();
        return res
          .status(500)
          .json({ error: "Error al obtener nuevo ID", detail: err.message });
      }

      const query = `
        INSERT INTO Cita (ID_Cita, ID_Paciente, ID_Medico, ID_Asistente, fecha, estado)
        VALUES (@apptId, @patientId, @medicId, @assistantId, @date, @status)
      `;

      const request = new Request(query, (err) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Error al insertar cita", detail: err.message });
        } else {
          res.status(200).json({ message: "Cita insertada correctamente." });
        }
        connection.close();
      });

      request.addParameter("apptId", TYPES.Int, newId);
      request.addParameter("patientId", TYPES.Int, patientId);
      request.addParameter("medicId", TYPES.Int, medicId);
      request.addParameter("assistantId", TYPES.Int, assistantId);
      request.addParameter("date", TYPES.DateTime, new Date(date));
      request.addParameter("status", TYPES.NVarChar, "pendiente");

      connection.execSql(request);
    });
  });

  connection.connect();
});

module.exports = { router };

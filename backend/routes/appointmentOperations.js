const { Request, TYPES } = require("tedious");
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

const getNextAppointmentId = (callback) => {
  const connection = db();

  connection.on("connect", (err) => {
    if (err) return callback(err);

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
      connection.close();
      callback(null, maxId + 1);
    });

    connection.execSql(request);
  });

  connection.connect();
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

    // Query con JOINs para traer el nombre del médico
    const query = `
      SELECT 
        C.ID_Cita,
        C.ID_Paciente,
        C.ID_Medico,
        C.ID_Asistente,
        C.fecha,
        C.estado,
        U.nombre AS doctorNombre,
        U.apellidoP AS doctorApellidoP,
        U.apellidoM AS doctorApellidoM
      FROM Cita C
      JOIN Medico M ON C.ID_Medico = M.ID_Medico
      JOIN Usuario U ON M.ID_Usuario = U.ID_Usuario
      WHERE C.ID_Paciente = @patientId
    `;

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

      // Transformar formato de salida aquí mismo
      const fechaObj = new Date(row.fecha);
      const fechaFormateada = fechaObj.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const horaFormateada = fechaObj.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });

      results.push({
        id: row.ID_Cita,
        date: fechaFormateada,
        time: horaFormateada,
        clinic: "Clínica - Colinas de San Miguel",
        doctor: `${row.doctorNombre} ${row.doctorApellidoP} ${row.doctorApellidoM}`,
        status: row.estado,
      });
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

  getNextAppointmentId((err, apptId) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener el ID de cita", detail: err.message });
    }

    const connection = db();

    connection.on("connect", (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error de conexión", detail: err.message });
      }

      const query = `INSERT INTO Cita (ID_Cita, ID_Paciente, ID_Medico, ID_Asistente, fecha, estado)
                     VALUES (@apptId, @patientId, @medicId, @assistantId, @date, @status)`;

      const request = new Request(query, (err) => {
        if (err) {
          connection.close();
          return res.status(500).json({
            error: "Error al ejecutar el INSERT",
            detail: err.message,
          });
        }

        res.status(200).json({
          message: "Cita creada correctamente",
          appointmentId: apptId,
        });
        connection.close();
      });

      request.addParameter("apptId", TYPES.Int, apptId);
      request.addParameter("patientId", TYPES.Int, patientId);
      request.addParameter("medicId", TYPES.Int, medicId);
      request.addParameter("assistantId", TYPES.Int, assistantId);
      request.addParameter("date", TYPES.DateTime, new Date(date));
      request.addParameter("status", TYPES.NVarChar, "pendiente");

      connection.execSql(request);
    });

    connection.connect();
  });
});

router.post('/cancelAppointment', (req, res) => {
    const { appointmentId } = req.body;

    // Validación mínima
    if (!appointmentId) {
        return res.status(400).send("Falta el ID de la cita");
    }

    const connection = db();
    const query = `UPDATE Cita SET estado = 'cancelada' WHERE ID_Cita = @appointmentId`;

    connection.on('connect', (err) => {
        if (err) return res.status(500).send("Error de conexión a la DB");

        const request = new Request(query, (err) => {
            connection.close();
            if (err) return res.status(500).send("Error al cancelar la cita");
            res.send("Cita cancelada"); // Respuesta simple (texto plano)
        });

        request.addParameter('appointmentId', TYPES.Int, appointmentId);
        connection.execSql(request);
    });

    connection.connect();
});

module.exports = { router };

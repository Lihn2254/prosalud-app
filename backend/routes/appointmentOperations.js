const { Request, TYPES } = require("tedious");
const jwt = require("jsonwebtoken");
const connection = require("../db/db.js");
const express = require("express");
const router = express.Router();

router.post("/getAppointments", (req, res) => {
  const { patientId } = req.body;
  if (!patientId) {
    return res.status(400).json({ error: "Se requiere pacienteId" });
  }

  Request(query, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al ejecutar la consulta", detail: err });
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

router.post("/newAppointment", (req, res) => {
  const { patientId, medicId, assistantId, date } = req.body;
  const query = `INSERT INTO Cita (ID_Paciente,ID_Medico,ID_Asistente,fecha,estado)`;
  const request = new Request(query, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al ejecutar la consulta", detail: err });
    } else {
      res.json(results);
    }
  });
});

module.exports = { router };

const { Request, TYPES } = require("tedious");
const jwt = require("jsonwebtoken");
const connection = require("./db/db.js");
const express = require("express");
const router = express.Router();

router.post("/getAppointments", (req, res) => {
  const { patientId } = req.body;
  const query = `SELECT * FROM Cita WHERE ID_Paciente = @patientId`;
  if (!patientId) {
    return res.status(400).json({ error: "Se requiere pacienteId" });
  }
  const request = new Request(query, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al ejecutar la consulta", detail: err });
    } else {
      res.json(results);
    }
    connection.close();
  });

  request.addParameter("patientId", TYPES.Int, patientId);

  request.addParameter("pacienteId", TYPES.Int, pacienteId);

  request.on("row", (columns) => {
    const row = {};
    columns.forEach((column) => {
      row[column.metadata.colName] = column.value;
    });
    results.push(row);
  });

  connection.execSql(request);
});

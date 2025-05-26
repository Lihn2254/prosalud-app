const { Request, TYPES } = require("tedious");
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.get("/getMedAppointments", (req, res) => {
  const medicId = parseInt(req.query.medicId);
  if (!medicId) {
    return res.status(400).json({ error: "Se requiere medicId válido" });
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
      select * from DetallesCita
        where ID_Medico = @medicId
    `;

    const request = new Request(query, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al ejecutar la consulta",
          detail: err.message,
        });
      }
    });

    request.addParameter("medicId", TYPES.Int, medicId);

    request.on("row", (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });

      results.push({
        id: row.ID_Cita,
        paciente: `${row.nombre} ${row.apellidoP} ${row.apellidoM}`,
        date: row.fecha,
        time: row.hora,
        clinic: `Clínica - ${row.sucursal}`,
        consultorio: `Consultorio - ${row.consultorio}`,
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

module.exports = { router };
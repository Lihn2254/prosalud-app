const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const { Request } = require("tedious");

router.get("/getDoctors", (req, res) => {
  const connection = db();
  const results = [];

  const horarios = [
    "08:00 - 09:00",
    "10:00 - 11:00",
    "13:00 - 14:00",
    "15:00 - 16:00",
  ];

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    const query = `
      SELECT 
        M.ID_Medico AS id,
        U.nombre,
        U.segundoNom,
        U.apellidoP,
        U.apellidoM,
        E.nombre AS specialty
      FROM Medico M
      JOIN Usuario U ON M.ID_Usuario = U.ID_Usuario
      JOIN Especialidad E ON M.ID_Especialidad = E.ID_Especialidad
    `;

    const request = new Request(query, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al ejecutar consulta", detail: err.message });
      }
    });

    request.on("row", (columns) => {
      const row = {};
      columns.forEach((col) => {
        row[col.metadata.colName] = col.value;
      });

      const fullName = `${row.nombre} ${row.segundoNom ?? ""} ${
        row.apellidoP
      } ${row.apellidoM}`
        .replace(/\s+/g, " ")
        .trim();

      results.push({
        id: row.id,
        name: fullName,
        specialty: row.specialty,
        timeSlot: horarios[results.length % horarios.length],
        available: true,
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

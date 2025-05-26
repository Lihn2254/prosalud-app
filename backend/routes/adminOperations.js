const { Request, TYPES } = require("tedious");
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.get("/getDoctorsAdmin", (req, res) => {
  const connection = db();
  const results = [];
  let responded = false; // Bandera para evitar múltiples respuestas

  connection.on("connect", (err) => {
    if (err) {
      if (!responded) {
        responded = true;
        return res
          .status(500)
          .json({ error: "Error de conexión", detail: err.message });
      }
      return;
    }

    const query = `
        SELECT 
            m.ID_Medico AS id,
            u.nombre + ' ' + u.apellidoP + ' ' + u.apellidoM AS name,
            e.nombre AS specialty,
            c.Num_Consultorio AS consultorio,
            c.ID_Sucursal AS sucursal,
            CONVERT(VARCHAR(5), c.inicioHorario, 108) AS inicioHorario,
            CONVERT(VARCHAR(5), c.finHorario, 108) AS finHorario
        FROM 
            Medico m
        JOIN Usuario u ON m.ID_Usuario = u.ID_Usuario
        JOIN Especialidad e ON m.ID_Especialidad = e.ID_Especialidad
        LEFT JOIN ConsultorioXMedico c ON m.ID_Medico = c.ID_Medico;
    `;

    const request = new Request(query, (err) => {
      if (err) {
        if (!responded) {
          responded = true;
          res.status(500).json({
            error: "Error al ejecutar la consulta",
            detail: err.message,
          });
          connection.close();
        }
        return;
      }
    });

    request.on("row", (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });

      results.push({
        id: row.id,
        name: row.name,
        specialty: row.specialty,
        consultorio: row.consultorio || "No asignado",
        sucursal: row.sucursal || "No asignado",
        horario:
          row.inicioHorario && row.finHorario
            ? `${row.inicioHorario} - ${row.finHorario}`
            : "No asignado",
      });
    });

    request.on("requestCompleted", () => {
      if (!responded) {
        responded = true;
        res.json(results);
      }
      connection.close();
    });

    connection.execSql(request);
  });

  connection.connect();
});

router.post("/upsertConsultorioMedico", (req, res) => {
  const connection = db();
  const { ID_Medico, Num_Consultorio, ID_Sucursal, inicioHorario, finHorario } =
    req.body;

  if (
    typeof inicioHorario !== "string" ||
    !inicioHorario.trim() ||
    typeof finHorario !== "string" ||
    !finHorario.trim()
  ) {
    return res.status(400).json({
      error: "Datos inválidos",
      detail:
        "inicioHorario y finHorario deben ser strings no vacíos con formato HH:mm o HH:mm:ss.",
    });
  }

  const inicioParts = inicioHorario.split(":");
  const finParts = finHorario.split(":");

  if (
    inicioParts.length < 2 ||
    inicioParts.length > 3 ||
    finParts.length < 2 ||
    finParts.length > 3
  ) {
    return res.status(400).json({
      error: "Formato de hora inválido",
      detail: "Usar formato HH:mm o HH:mm:ss.",
    });
  }

  const inicioH = parseInt(inicioParts[0], 10);
  const inicioM = parseInt(inicioParts[1], 10);
  const inicioS = inicioParts[2] ? parseInt(inicioParts[2], 10) : 0;

  const finH = parseInt(finParts[0], 10);
  const finM = parseInt(finParts[1], 10);
  const finS = finParts[2] ? parseInt(finParts[2], 10) : 0;

  if (
    isNaN(inicioH) ||
    isNaN(inicioM) ||
    isNaN(inicioS) ||
    isNaN(finH) ||
    isNaN(finM) ||
    isNaN(finS) ||
    inicioH < 0 ||
    inicioH > 23 ||
    inicioM < 0 ||
    inicioM > 59 ||
    inicioS < 0 ||
    inicioS > 59 ||
    finH < 0 ||
    finH > 23 ||
    finM < 0 ||
    finM > 59 ||
    finS < 0 ||
    finS > 59
  ) {
    return res.status(400).json({
      error: "Valores de hora inválidos",
      detail:
        "Las horas, minutos o segundos no son números o están fuera de rango (HH: 0-23, mm: 0-59, ss: 0-59).",
    });
  }

  const inicio = new Date(1970, 0, 1, inicioH, inicioM, inicioS);
  const fin = new Date(1970, 0, 1, finH, finM, finS);

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM ConsultorioXMedico WHERE ID_Medico = @ID_Medico`;
    const checkRequest = new Request(checkQuery, (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error al verificar", detail: err.message });
    });

    let count = 0;

    checkRequest.on("row", (columns) => {
      count = columns[0].value;
    });

    checkRequest.on("requestCompleted", () => {
      if (count > 0) {
        const updateQuery = `
          UPDATE ConsultorioXMedico
          SET Num_Consultorio = @Num_Consultorio,
              ID_Sucursal = @ID_Sucursal,
              inicioHorario = @inicioHorario,
              finHorario = @finHorario
          WHERE ID_Medico = @ID_Medico
        `;
        const updateRequest = new Request(updateQuery, (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al actualizar", detail: err.message });
          res.json({ message: "Médico actualizado correctamente" });
          connection.close();
        });

        updateRequest.addParameter("ID_Medico", TYPES.Int, ID_Medico);
        updateRequest.addParameter(
          "Num_Consultorio",
          TYPES.Int,
          Num_Consultorio
        );
        updateRequest.addParameter("ID_Sucursal", TYPES.Int, ID_Sucursal);
        updateRequest.addParameter("inicioHorario", TYPES.Time, inicio);
        updateRequest.addParameter("finHorario", TYPES.Time, fin);

        connection.execSql(updateRequest);
      } else {
        const insertQuery = `
          INSERT INTO ConsultorioXMedico (ID_Medico, Num_Consultorio, ID_Sucursal, inicioHorario, finHorario)
          VALUES (@ID_Medico, @Num_Consultorio, @ID_Sucursal, @inicioHorario, @finHorario)
        `;
        const insertRequest = new Request(insertQuery, (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al insertar", detail: err.message });
          res.json({ message: "Médico añadido correctamente" });
          connection.close();
        });

        insertRequest.addParameter("ID_Medico", TYPES.Int, ID_Medico);
        insertRequest.addParameter(
          "Num_Consultorio",
          TYPES.Int,
          Num_Consultorio
        );
        insertRequest.addParameter("ID_Sucursal", TYPES.Int, ID_Sucursal);
        insertRequest.addParameter("inicioHorario", TYPES.Time, inicio);
        insertRequest.addParameter("finHorario", TYPES.Time, fin);

        connection.execSql(insertRequest);
      }
    });

    checkRequest.addParameter("ID_Medico", TYPES.Int, ID_Medico);
    connection.execSql(checkRequest);
  });

  connection.connect();
});

module.exports = { router };

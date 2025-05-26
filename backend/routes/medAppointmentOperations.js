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

    const query = `
      select * from DetallesCita
        where ID_Medico = @medicId and estado = 'pendiente'
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
        id_cita: row.ID_Cita,
        id_usuario: row.ID_Usuario,
        id_paciente: row.ID_Paciente,
        paciente: `Paciente - ${row.nombre} ${row.apellidoP} ${row.apellidoM}`,
        date: row.fecha,
        time: row.hora,
        clinic: `Clínica - ${row.sucursal}`,
        consultorio: `Consultorio - ${row.consultorio}`,
        estado: row.estado,
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

router.get("/onGoingAppointment", (req, res) => {
  const id_cita = parseInt(req.query.id_cita);
  if (!id_cita) {
    return res.status(400).json({ error: "Se requiere id_cita válido" });
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
      select * from DetallesConsulta
        where ID_Cita = @id_cita
    `;

    const request = new Request(query, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al ejecutar la consulta",
          detail: err.message,
        });
      }
    });

    request.addParameter("id_cita", TYPES.Int, id_cita);

    request.on("row", (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });

      results.push({
        folioConsulta: row.folioConsulta,
        id_cita: row.ID_Cita,
        id_usuario: row.ID_Usuario,
        id_paciente: row.ID_Paciente,
        paciente: `${row.nombre} ${row.apellidoP} ${row.apellidoM}`,
        edad: row.edad,
        genero: row.genero,
        estado: row.estado,
        diagnostico: row.diagnostico,
        observaciones: row.observaciones
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
  const { folioConsulta, id_cita, nuevoDiagnostico, nuevasObservaciones, recetaTexto} = req.body;

  const connection = db();

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    const query = `EXEC InsertarConsultaDesdeVista @folio = @folioConsulta, @ID_Cita = @id_cita, 
    @diagnostico = @nuevoDiagnostico, @observaciones = @nuevasObservaciones,
    @detalles = @recetaTexto;`;

    const request = new Request(query, (err) => {
      if (err) {
        connection.close();
        return res.status(500).json({
          error: "Error al ejecutar el INSERT",
          detail: err.message,
        });
      }

      res.status(200).json({
        message: "Consulta guardada correctamente",
      });
      connection.close();
    });

    request.addParameter("folioConsulta", TYPES.Int, folioConsulta);
    request.addParameter("id_cita", TYPES.Int, id_cita);
    request.addParameter('nuevoDiagnostico', TYPES.NVarChar, nuevoDiagnostico, { length: 150 });
    request.addParameter('nuevasObservaciones', TYPES.NVarChar, nuevasObservaciones, { length: 400 });
    request.addParameter('recetaTexto', TYPES.NVarChar, recetaTexto, { length: 400 });

    connection.execSql(request);
  });

  connection.connect();
});

module.exports = { router };
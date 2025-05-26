const { Request, TYPES } = require("tedious");
const jwt = require("jsonwebtoken");
const getConnection = require("../db/db.js");
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const connection = getConnection();

  connection.on("connect", (err) => {
    if (err) {
      console.error("Connection failed", err);
      res.status(500).send("Error de conexión");
      return;
    }

    const sql =
      "SELECT * FROM UsuarioTipo WHERE email = @email AND password = @password";
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Request error", err);
        res.status(500).send("Error en la consulta");
      } else if (rowCount === 0) {
        res.status(401).send("Credenciales inválidas");
      }
    });

    // Escuchar el evento 'row' para construir el objeto usuario
    request.on("row", (columns) => {
      let usuario = {};
      columns.forEach((column) => {
        usuario[column.metadata.colName] = column.value;
      });

      usuario.ID_Usuario = parseInt(usuario.ID_Usuario, 10);
      /*usuario.ID_Paciente = parseInt(usuario.ID_Paciente, 10);
            usuario.ID_Medico = parseInt(usuario.ID_Medico, 10);
            usuario.ID_Administrador = parseInt(usuario.ID_Administrador, 10);
            usuario.ID_Asistente = parseInt(usuario.ID_Asistente, 10);*/

      const token = jwt.sign(
        {
          ID_Usuario: usuario.ID_Usuario,
          nombre: usuario.nombre,
          //segundoNom: usuario.segundoNom,
          apellidoP: usuario.apellidoP,
          apellidoM: usuario.apellidoM,
          email: usuario.email,
          ID_Paciente: usuario.ID_Paciente,
          ID_Medico: usuario.ID_Medico,
          ID_Administrador: usuario.ID_Administrador,
          ID_Asistente: usuario.ID_Asistente,
        },
        "secretKey"
      );

      res.json({ token });
      //connection.close();
    });

    request.addParameter("email", TYPES.VarChar, email);
    request.addParameter("password", TYPES.VarChar, password);
    connection.execSql(request);
  });

  connection.connect();
});

router.get("/getExpediente", (req, res) => {
  const patientId = parseInt(req.query.patientId);
  if (!patientId) {
    return res.status(400).json({ error: "Se requiere patientId válido" });
  }

  const connection = getConnection();
  const results = [];

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    // Query con JOINs para traer el nombre del médico
    const query = `
      select * from ConsultasTerminadas
      where ID_Paciente = @patientId
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

      const nombreMedico = `${row.nombreMedico} ${row.apellidoPMedico ?? ""} ${row.apellidoMMedico ?? ""}`.trim();

      results.push({
        folioConsulta: row.folio,
        id_cita: row.ID_Cita,
        id_sucursal: row.ID_Sucursal,
        nombreSucursal: row.nombreSucursal,
        num_Consultorio: row.Num_Consultorio,
        nombreConsultorio: row.nombreConsultorio,
        id_paciente: row.ID_Paciente,
        nombre: row.nombre,
        apellidoP: row.apellidoP,
        apellidoM: row.apellidoM,
        fecha: row.fecha,
        hora: row.hora,
        estado: row.estado,
        diagnostico: row.diagnostico,
        observaciones: row.observaciones, 
        id_medico: row.ID_Medico,
        nombreMedico: nombreMedico,
        especialidad: row.especialidad,
        receta: row.detalles,
      });
    });

    request.on("requestCompleted", () => {
      res.json(results);
      connection.close();
    });

    console.log(results);
    connection.execSql(request);
  });

  connection.connect();
});

router.get("/getInfoUsuario", (req, res) => {
  const patientId = parseInt(req.query.patientId);
  if (!patientId) {
    return res.status(400).json({ error: "Se requiere patientId válido" });
  }

  const connection = getConnection();
  const results = [];

  connection.on("connect", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error de conexión", detail: err.message });
    }

    // Query con JOINs para traer el nombre del médico
    const query = `
      select * from DetallesExpediente
      where ID_Paciente = @patientId
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

      const nombrePaciente = `${row.nombre} ${row.apellidoP ?? ""} ${row.apellidoM ?? ""}`.trim();

      results.push({
        id_expediente: row.ID_Expediente,
        id_paciente: row.ID_Paciente,
        id_usuario: row.ID_Usuario,
        nombre: nombrePaciente,
        edad: row.edad,
        genero: row.genero,
        fecha_alta: row.fecha_alta,
        antecedentes: row.antecedentes,
        alergias: row.alergias,
        enfermedades: row.enfermedades,
      });

      console.log(results);
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

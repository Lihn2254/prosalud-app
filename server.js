const express = require('express');
const bodyParser = require('body-parser');
const { Connection, Request, TYPES } = require('tedious');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const config = {
    server: 'erick-server.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: 'Erick2254',
            password: 'Evangelion01',
        }
    },
    options: {
        encrypt: true,
        database: 'prosalud',
    }
};

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const connection = new Connection(config);

    connection.on('connect', (err) => {
        if (err) {
            console.error('Connection failed', err);
            res.status(500).send('Error de conexión');
            return;
        }

        const sql = 'SELECT * FROM UsuarioTipo WHERE email = @email AND password = @password';
        const request = new Request(sql, (err, rowCount) => {
            if (err) {
                console.error('Request error', err);
                res.status(500).send('Error en la consulta');
                connection.close();
            } else if (rowCount === 0) {
                res.status(401).send('Credenciales inválidas');
                connection.close();
            }
        });

        // Escuchar el evento 'row' para construir el objeto usuario
        request.on('row', columns => {
            let usuario = {};
            columns.forEach(column => {
                usuario[column.metadata.colName] = column.value;
            });

            usuario.ID_Usuario = parseInt(usuario.ID_Usuario, 10);
            /*usuario.ID_Paciente = parseInt(usuario.ID_Paciente, 10);
            usuario.ID_Medico = parseInt(usuario.ID_Medico, 10);
            usuario.ID_Administrador = parseInt(usuario.ID_Administrador, 10);
            usuario.ID_Asistente = parseInt(usuario.ID_Asistente, 10);*/

            const token = jwt.sign({
                    ID_Usuario: usuario.ID_Usuario,
                    nombre: usuario.nombre,
                    segundoNom: usuario.segundoNom,
                    apellidoP: usuario.apellidoP,
                    apellidoM: usuario.apellidoM,
                    email: usuario.email,
                    ID_Paciente: usuario.ID_Paciente,
                    ID_Medico: usuario.ID_Medico,
                    ID_Administrador: usuario.ID_Administrador,
                    ID_Asistente: usuario.ID_Asistente
                }, 'secretKey', { expiresIn: '24h' });

                res.json({ token });
                //connection.close();
        });

        request.addParameter('email', TYPES.VarChar, email);
        request.addParameter('password', TYPES.VarChar, password);
        connection.execSql(request);
    });

    connection.connect();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

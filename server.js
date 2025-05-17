const express = require('express');
const bodyParser = require('body-parser');
const { Connection, Request } = require('tedious');

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

        const sql = `SELECT * FROM Users WHERE email = @email AND password = @password`;
        const request = new Request(sql, (err, rowCount) => {
            if (err) {
                console.error('Request error', err);
                res.status(500).send('Error en la consulta');
            } else if (rowCount === 0) {
                res.status(401).send('Credenciales inválidas');
            } else {
                res.status(200).send('Inicio de sesión exitoso');
            }
            connection.close();
        });

        request.addParameter('email', TYPES.VarChar, email);
        request.addParameter('password', TYPES.VarChar, password); // Asegúrate de usar hashes reales en producción
        connection.execSql(request);
    });

    connection.connect();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

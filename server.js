const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());

const uri = 'mongodb+srv://erick:Eva01@testcluster.igbelqr.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster'; // Cambia según tu configuración
const dbName = 'sample_mflix';
const PORT = 3000;

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    const users = await collection.find({}, { projection: { _id: 0, name: 1, email: 1 } }).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuarios');
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

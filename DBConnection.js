const { MongoClient } = require('mongodb');

// Cambia esta URI por la de tu base de datos MongoDB
const uri = 'mongodb+srv://erick:Eva01@testcluster.igbelqr.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster'; // o usa una URI de MongoDB Atlas

// Nombre de la base de datos a la que te quieres conectar
const dbName = 'sample_mflix';

async function conectarMongoDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('users');

    // Obtener solo los campos name y email
    const usuarios = await collection.find({}, { projection: { _id: 0, name: 1, email: 1 } }).toArray();

    if (usuarios.length === 0) {
      console.log('ℹ️ No se encontraron usuarios en la colección.');
    } else {
      console.log('📋 Lista de usuarios:');
      usuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. Nombre: ${usuario.name}, Email: ${usuario.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  } finally {
    await client.close();
  }
}

conectarMongoDB();

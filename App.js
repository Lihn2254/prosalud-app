import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://192.168.1.3:3000/users') // Reemplaza con tu IP real
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('❌ Error al obtener usuarios:', error);
        setCargando(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.nombre}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </View>
  );

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>📋 Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 12 },
  nombre: { fontSize: 18 },
  email: { fontSize: 14, color: 'gray' }
});

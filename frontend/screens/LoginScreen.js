import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
import colors from '../styles/colors';
import { jwtDecode } from "jwt-decode"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Iniciando sesión con:', email)
    try {
      const response = await fetch('http://192.168.1.3:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      const token = data.token;

      if (response.status === 200) {
        // Decodificar el token para obtener los atributos
        const usuario = jwtDecode(token);

        // Guardar el token y atributos en AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('usuarioID_Usuario', usuario.ID_Usuario.toString());
        await AsyncStorage.setItem('usuarioNombre', usuario.nombre);
        await AsyncStorage.setItem('usuarioApellidoP', usuario.apellidoP);
        await AsyncStorage.setItem('usuarioApellidoM', usuario.apellidoM);
        await AsyncStorage.setItem('usuarioEmail', usuario.email);
        await AsyncStorage.setItem('usuarioNombre', usuario.nombre);

        // Navegar a la pantalla principal de paciente
        if (usuario.ID_Paciente !== null) {
          navigation.navigate('HomeScreen');
        } else if (usuario.ID_Medico !== null) {
          navigation.navigate('HomeMedico');
        } else if (usuario.ID_Administrador !== null) {
          Alert.alert('Inicio de sesión exitoso', 'Administrador');
          //navigation.navigate('HomeScreen');
        } else if (usuario.ID_Asistente !== null) {
          Alert.alert('Inicio de sesión exitoso', 'Asistente');
          //navigation.navigate('HomeScreen');
        } else {
          Alert.alert('Error', 'No se pudo determinar el tipo de usuario. Favor de contactar a Soporte Técnico.');
        }
      } else {
        Alert.alert('Error', text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/ProSalud_logo.jpg')} style={styles.logo} />
      <Text style={{ fontSize: 60, marginBottom: 20 }}>ProSalud</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/*
              Este es el código que se va a usar para que al presionar el botón de iniciar sesión, se ejecuta la función handleLogin
              El otro código, debajo de este, es un placeholder para navegar a la pantalla principal sin hacer la conexión al servidor, como prueba nada más

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              */}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  registerButton: {
    width: '100%',
    height: 48,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 18,
  },
  forgotText: {
    fontSize: 14,
    color: '#666',
  },
});
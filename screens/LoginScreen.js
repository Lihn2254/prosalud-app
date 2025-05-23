import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import colors from '../styles/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Iniciando sesión con:', email)
    try {
      const response = await fetch('http://192.168.1.3:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const token = data.token;

      if (response.status === 200) {
        // Decodificar el token para obtener los atributos
        const user = jwtDecode(token);

        // Guardar el token y atributos en AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userID_Usuario', user.ID_Usuario.toString());
        await AsyncStorage.setItem('userNombre', user.nombre);
        await AsyncStorage.setItem('userSegundoNom', user.segundoNom);
        await AsyncStorage.setItem('userApellidoP', user.apellidoP);
        await AsyncStorage.setItem('userApellidoM', user.apellidoM);
        await AsyncStorage.setItem('userEmail', user.email);
        /*
        await AsyncStorage.setItem('userID_Paciente', user.ID_Paciente.toString());
        await AsyncStorage.setItem('userID_Medico', user.ID_Medico.toString());
        await AsyncStorage.setItem('userID_Administrador', user.ID_Administrador.toString());
        await AsyncStorage.setItem('userID_Asistente', user.ID_Asistente.toString());
        */

        // Navegar a la pantalla principal de paciente
        if (user.idPaciente !== null) {
          navigation.navigate('HomeScreen');
        } else if (user.idMedico !== null) {
          Alert.alert('Inicio de sesión exitoso', 'Médico');
          //navigation.navigate('HomeScreen');
        } else if (user.idAdministrador !== null) {
          Alert.alert('Inicio de sesión exitoso', 'Administrador');
          //navigation.navigate('HomeScreen');
        } else if (user.idAsistente !== null) {
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
              */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/*
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              */}

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
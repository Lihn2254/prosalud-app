import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import colors from "../styles/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      if (response.status === 200) {
        Alert.alert("Éxito", text);
        // Guardar la información del usuario y navegar a la pantalla principal
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/ProSalud_logo.jpg")}
        style={styles.logo}
      />
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => handleLogin()}
      >
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    resizeMode: "contain",
  },
  input: {
    width: "80%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    width: "80%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  registerButton: {
    width: "80%",
    height: 48,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 18,
  },
  forgotText: {
    fontSize: 14,
    color: "#666",
  },
});

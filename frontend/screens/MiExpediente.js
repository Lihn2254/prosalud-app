"use client"

import { useState, useEffect } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native"
import ip from "../utils/myIP";
import colors from "../styles/colors"
import { Container } from "../components/container"
import { LineaHorizontal } from "../components/linea"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function MiExpedienteScreen({ navigation }) {
  const [userData, setUserData] = useState([])
  const [pastAppointments, setPastAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
    loadPastAppointments()
  }, [])

  const loadUserData = async () => {
    try {
      const pacienteIDString = await AsyncStorage.getItem(
        "usuarioPacienteID"
      );
      const patientId = parseInt(pacienteIDString);
      if (!patientId) return;
      console.log("Antes de fetch: ", patientId);

      const response = await fetch(`http://${ip}:3000/users/getInfoUsuario?patientId=${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })

      console.log("Después de fetch: ", patientId);

      if (!response.ok) {
        throw new Error("Error al obtener la información del usuario")
      }

      const data = await response.json()
      console.log(data);

      if (Array.isArray(data)) {
        setUserData(data[0]);
      } else {
        setUserData({});
        console.warn("Respuesta inesperada:", data);
      }

      setLoading(false)
    } catch (error) {
      console.error("Error al cargar la información del usuario:", error)
      setLoading(false)
    }
  }

  const loadPastAppointments = async () => {
    try {
      const pacienteIDString = await AsyncStorage.getItem(
        "usuarioPacienteID"
      );
      const patientId = parseInt(pacienteIDString);
      if (!patientId) return;
      console.log("Antes de fetch: ", patientId);

      const response = await fetch(`http://${ip}:3000/users/getExpediente?patientId=${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })

      console.log("Después de fetch: ", patientId);

      if (!response.ok) {
        throw new Error("Error al obtener el expediente")
      }

      const data = await response.json()
      console.log(data);

      if (Array.isArray(data)) {
        setPastAppointments(data || []);
      } else {
        console.warn("Respuesta inesperada:", data);
      }

      setLoading(false)
    } catch (error) {
      console.error("Error al cargar el expediente:", error)
      setLoading(false)
    }
  }

  const getFullName = () => {
    return `${userData.nombre} ${userData.apellidoP} ${userData.apellidoM}`.trim()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completada":
        return "#4CAF50"
      case "Cancelada":
        return "#F44336"
      default:
        return colors.textSecondary
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando expediente...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/ProSalud_logo.jpg")} style={styles.logo} />
          <Text style={styles.logoText}>Expediente médico</Text>
        </View>
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.nombre}</Text>
            <Text style={styles.userDetails}>
              {userData.edad} años - {userData.genero}
            </Text>
            <Text style={styles.userDetails}>Antecedentes - {userData.antecedentes} </Text>
            <Text style={styles.userDetails}>Alergias - {userData.alergias} </Text>
            <Text style={styles.userDetails}>Enfermedades - {userData.enfermedades} </Text>
            <Text style={styles.userDetails}>Fecha de alta - {userData.fecha_alta} </Text>
          </View>
        <LineaHorizontal />
        {/* Past Appointments Section */}
        <Container style={styles.appointmentsContainer}>
          {pastAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay citas anteriores</Text>
            </View>
          ) : (
            pastAppointments.map((appointment) => (
              <View key={appointment.folioConsulta} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDate}>
                    {appointment.fecha} | {appointment.hora}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: "green" }]}>
                    <Text style={styles.statusText}>{appointment.estado}</Text>
                  </View>
                </View>

                <Text style={styles.appointmentSpecialty}>{appointment.especialidad}</Text>
                <Text style={styles.appointmentDoctor}>{appointment.nombreMedico}</Text>
                <Text style={styles.appointmentLocation}>{appointment.sucursal}</Text>

                {appointment.diagnostico && (
                  <View style={styles.diagnosisContainer}>
                    <Text style={styles.diagnosisLabel}>Diagnóstico:</Text>
                    <Text style={styles.diagnosisText}>{appointment.diagnostico}</Text>
                  </View>
                )}

                {appointment.receta && (
                  <View style={styles.diagnosisContainer}>
                    <Text style={styles.diagnosisLabel}>Receta:</Text>
                    <Text style={styles.diagnosisText}>{appointment.receta}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Ver detalles completos</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Container>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("HomeScreen")}>
          <Image source={require("../assets/casa.png")} style={styles.tabIcon} />
          <Text style={styles.tabText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image source={require("../assets/usuario.png")} style={styles.tabIcon} />
          <Text style={[styles.tabText, styles.activeTabText]}>Mi Expediente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image source={require("../assets/puerta.png")} style={styles.tabIcon} />
          <Text style={styles.tabText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileContainer: {
    backgroundColor: colors.white,
    borderRadius: 1,
    borderWidth: 0,
    borderColor: colors.primary,
    elevation: 0,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentsContainer: {
    backgroundColor: colors.white,
    padding: 1,
    marginVertical: 1,
    borderWidth: 0,
    elevation: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  appointmentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#FAFAFA",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  appointmentSpecialty: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  appointmentDoctor: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  appointmentLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  diagnosisContainer: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  detailsButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 15,
  },
  detailsButtonText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: colors.text,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
})
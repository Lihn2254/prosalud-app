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
import colors from "../styles/colors"
import { Container } from "../components/container"
import { LineaHorizontal } from "../components/linea"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function MiExpedienteScreen({ navigation }) {
  const [userData, setUserData] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    edad: "",
    genero: "",
  })
  const [pastAppointments, setPastAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // Sample past appointments data - replace with actual API call
  const samplePastAppointments = [
    {
      id: 1,
      date: "Marzo 15, 2025",
      time: "10:00",
      clinic: "Clínica - Colinas de San Miguel",
      doctor: "Dr. Carlos Mendoza",
      specialty: "Medicina General",
      status: "Completada",
      diagnosis: "Revisión general - Todo normal",
    },
    {
      id: 2,
      date: "Febrero 28, 2025",
      time: "14:30",
      clinic: "Clínica - Centro",
      doctor: "Dra. Ana García López",
      specialty: "Cardiología",
      status: "Completada",
      diagnosis: "Control de presión arterial",
    },
    {
      id: 3,
      date: "Enero 20, 2025",
      time: "09:15",
      clinic: "Clínica - Norte",
      doctor: "Dr. Javier Lizárraga Moreno",
      specialty: "Cardiología",
      status: "Completada",
      diagnosis: "Electrocardiograma - Resultados normales",
    },
    {
      id: 4,
      date: "Diciembre 10, 2024",
      time: "16:00",
      clinic: "Clínica - Colinas de San Miguel",
      doctor: "Dra. María Rodríguez",
      specialty: "Dermatología",
      status: "Completada",
      diagnosis: "Revisión de lunares - Sin anomalías",
    },
  ]

  useEffect(() => {
    loadUserData()
    loadPastAppointments()
  }, [])

  const loadUserData = async () => {
    try {
      const nombre = (await AsyncStorage.getItem("usuarioNombre")) || ""
      const apellidoP = (await AsyncStorage.getItem("usuarioApellidoP")) || ""
      const apellidoM = (await AsyncStorage.getItem("usuarioApellidoM")) || ""

      // Calculate age from birth date (you might need to store birth date)
      // For now, using a placeholder age
      const edad = "49" // This should be calculated from actual birth date
      const genero = "Hombre" // This should come from user data

      setUserData({
        nombre,
        apellidoP,
        apellidoM,
        edad,
        genero,
      })
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const loadPastAppointments = async () => {
    try {
      // Here you would make an API call to get past appointments
      // For now, using sample data
      setPastAppointments(samplePastAppointments)
      setLoading(false)
    } catch (error) {
      console.error("Error loading past appointments:", error)
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
          <Text style={styles.logoText}>ProSalud</Text>
        </View>
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <Container style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../assets/ProSalud_logo.jpg")} // Replace with actual user photo
                style={styles.avatar}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{getFullName()}</Text>
              <Text style={styles.userDetails}>
                {userData.edad} años - {userData.genero}
              </Text>
            </View>
          </View>
        </Container>

        {/* Past Appointments Section */}
        <Container style={styles.appointmentsContainer}>
          <Text style={styles.sectionTitle}>Historial de Citas</Text>
          <LineaHorizontal />

          {pastAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay citas anteriores</Text>
            </View>
          ) : (
            pastAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDate}>
                    {appointment.date} | {appointment.time}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>

                <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
                <Text style={styles.appointmentLocation}>{appointment.clinic}</Text>

                {appointment.diagnosis && (
                  <View style={styles.diagnosisContainer}>
                    <Text style={styles.diagnosisLabel}>Diagnóstico:</Text>
                    <Text style={styles.diagnosisText}>{appointment.diagnosis}</Text>
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
    paddingVertical: 15,
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
    fontSize: 20,
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
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
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
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
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

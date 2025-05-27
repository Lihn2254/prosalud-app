import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
} from "react-native";
import colors from "../styles/colors";
import ip from "../utils/myIP";
import { Container } from "../components/container";
import { LineaHorizontal } from "../components/linea";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function HomeScreen({ navigation }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const [clinicModalVisible, setClinicModalVisible] = useState(false);
  const [appointmentDetailsVisible, setAppointmentDetailsVisible] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const pacienteIDString = await AsyncStorage.getItem(
          "usuarioPacienteID"
        );
        const pacienteID = parseInt(pacienteIDString);
        if (!pacienteID) return;

        const response = await fetch(
          `http://${ip}:3000/appointments/getAppointments?patientId=${pacienteID}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.warn("Respuesta inesperada:", data);
        }
      } catch (error) {
        console.error("Error al obtener citas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  /*
  const appointments = [
    {
      id: 1,
      date: "Abril 30, 2025",
      time: "13:00",
      clinic: "Clínica - Colinas de San Miguel",
      clinicAddress: "Av. Colinas de San Miguel #654",
      doctor: "Dra. Ana García López",
      specialty: "Cardiología",
    },
    {
      id: 2,
      date: "Abril 30, 2025",
      time: "16:00",
      clinic: "Clínica - Colinas de San Miguel",
      clinicAddress: "Av. Colinas de San Miguel #654",
      doctor: "Dra. Ana García López",
      specialty: "Cardiología",
    },
    {
      id: 3,
      date: "Abril 30, 2025",
      time: "16:00",
      clinic: "Clínica - Colinas de San Miguel",
      clinicAddress: "Av. Colinas de San Miguel #654",
      doctor: "Dra. Ana García López",
      specialty: "Medicina General",
    },
    {
      id: 4,
      date: "Abril 30, 2025",
      time: "16:00",
      clinic: "Clínica - Colinas de San Miguel",
      clinicAddress: "Av. Colinas de San Miguel #654",
      doctor: "Dra. Ana García López",
      specialty: "Dermatología",
    },
  ]
*/
  const clinics = [
    {
      id: 1,
      name: "Clínica Norte",
      phone: "+52 667 313 4981",
      address: "Av. Constitución Norte #123",
    },
    {
      id: 2,
      name: "Clínica Sur",
      phone: "+52 667 409 1095",
      address: "Blvd. Díaz Ordaz Sur #456",
    },
    {
      id: 3,
      name: "Clínica Este",
      phone: "+52 81 3456-7890",
      address: "Av. Eloy Cavazos #789",
    },
    {
      id: 4,
      name: "Clínica Oeste",
      phone: "+52 81 4567-8901",
      address: "Av. Miguel Alemán #321",
    },
    {
      id: 5,
      name: "Clínica Colinas de San Miguel",
      phone: "+52 81 5678-9012",
      address: "Av. Colinas de San Miguel #654",
    },
  ];

  const handleCallClinic = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/[\s-]/g, "");
    Linking.openURL(`tel:${cleanPhone}`);
  };

  const openClinicModal = () => {
    setClinicModalVisible(true);
  };

  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailsVisible(true);
  };

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // Clear all user data from AsyncStorage
      await AsyncStorage.multiRemove([
        "token",
        "usuarioID_Usuario",
        "usuarioNombre",
        "usuarioApellidoP",
        "usuarioPacienteID",
        "usuarioApellidoM",
        "usuarioEmail",
      ]);

      console.log("AsyncStorage cleared successfully");

      // Clear user context if needed
      setUsuario(null);

      // Try different navigation methods based on your navigation setup
      try {
        // Method 1: Try navigation.reset first
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }], // Try "LoginScreen" instead of "Login"
        });
      } catch (resetError) {
        console.log("Reset failed, trying navigate...");
        try {
          // Method 2: Try simple navigation
          navigation.navigate("LoginScreen");
        } catch (navigateError) {
          console.log("Navigate to LoginScreen failed, trying Login...");
          try {
            // Method 3: Try with "Login" name
            navigation.navigate("Login");
          } catch (loginError) {
            console.log("All navigation methods failed, trying goBack...");
            // Method 4: As last resort, go back to previous screen
            navigation.goBack();
          }
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, try to navigate away
      try {
        navigation.goBack();
      } catch (navError) {
        console.error("Navigation also failed:", navError);
      }
    }
  };

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/ProSalud_logo.jpg")}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Mis citas</Text>
        </View>
      </View>

      <LineaHorizontal></LineaHorizontal>

      <ScrollView style={styles.content}>
        <Container style={styles.appointmentsContainer}>
          {
            //ESTE APPOINTEMNT SIRVE PARA VER COMO FUNCIONA EL CONTAINER Y QUE LOS DATOS SE MUESTREN EN EL SCROLLVIEW

            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDate}>
                    {appointment.date} | {appointment.time}
                  </Text>
                </View>
                <Text style={styles.appointmentLocation}>
                  {appointment.clinic}
                </Text>
                <Text style={styles.appointmentDoctor}>
                  {appointment.doctor}
                </Text>

                <View style={styles.appointmentActions}>
                  <TouchableOpacity style={styles.modifyButton}>
                    <Text
                      style={styles.modifyButtonText}
                      onPress={() =>
                        navigation.navigate("ModificarCita", { appointment })
                      }
                    >
                      Modificar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => openAppointmentDetails(appointment)}
                  >
                    <Text style={styles.detailsButtonText}>Ver detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </Container>
      </ScrollView>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() => navigation.navigate("Agendarcita")}
      >
        <Text style={styles.scheduleButtonText}>Agendar Nueva Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton} onPress={openClinicModal}>
        <Image
          source={require("../assets/telefono.png")}
          style={{ width: 20, height: 20 }}
        />
        <Text style={styles.contactButtonText}>Contactar Clínica</Text>
      </TouchableOpacity>

      {/* Clinic Contact Modal */}
      <Modal
        visible={clinicModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClinicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.clinicModalContent}>
            <Text style={styles.modalTitle}>Contactar Clínica</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona la clínica que deseas contactar
            </Text>

            <ScrollView
              style={styles.clinicsList}
              showsVerticalScrollIndicator={false}
            >
              {clinics.map((clinic) => (
                <TouchableOpacity
                  key={clinic.id}
                  style={styles.clinicItem}
                  onPress={() => handleCallClinic(clinic.phone)}
                >
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    <Text style={styles.clinicPhone}>{clinic.phone}</Text>
                  </View>
                  <View style={styles.callIcon}>
                    <Image
                      source={require("../assets/telefono.png")}
                      style={{ width: 24, height: 24 }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setClinicModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        visible={appointmentDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAppointmentDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.appointmentDetailsModalContent}>
            <Text style={styles.modalTitle}>Detalles de la Cita</Text>

            {selectedAppointment && (
              <View style={styles.appointmentDetailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📅 Fecha y Hora:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.date} | {selectedAppointment.time}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🩺 Especialidad:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.specialty}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>👨‍⚕️ Doctor:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.doctor}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🏥 Clínica:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.clinic}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📍 Dirección:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.clinicAddress}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeDetailsButton}
              onPress={() => setAppointmentDetailsVisible(false)}
            >
              <Text style={styles.closeDetailsButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <Text style={styles.logoutModalTitle}>Cerrar Sesión</Text>
            <Text style={styles.logoutModalText}>
              ¿Estás seguro que quieres cerrar sesión?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalNoButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.logoutModalNoText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalYesButton]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.logoutModalYesText}>Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Image
            source={require("../assets/casa.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={[styles.tabText, styles.activeTabText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("MiExpediente")}
        >
          <Image
            source={require("../assets/usuario.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.tabText}>Mi Expediente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={openLogoutModal}>
          <Image
            source={require("../assets/puerta.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.tabText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: "50",
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
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 5,
  },
  appointmentsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  appointmentCard: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  appointmentHeader: {
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  appointmentLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentDoctor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modifyButton: {
    padding: 8,
  },
  modifyButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 30,
    borderRadius: 25,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  contactButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    padding: 12,
    marginVertical: 20,
    marginHorizontal: 80,
  },
  contactButtonText: {
    color: colors.primary,
    marginLeft: 10,
    fontSize: 16,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  clinicModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  clinicsList: {
    maxHeight: 400,
  },
  clinicItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },
  clinicPhone: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  callIcon: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 8,
    marginLeft: 10,
  },
  closeModalButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  closeModalButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "500",
  },
  appointmentDetailsModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  appointmentDetailsContainer: {
    marginVertical: 20,
  },
  detailRow: {
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
  closeDetailsButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  closeDetailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
  },
  logoutModalText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  logoutModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  logoutModalButton: {
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  logoutModalNoButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  logoutModalYesButton: {
    backgroundColor: "#E53E3E",
  },
  logoutModalNoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  logoutModalYesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

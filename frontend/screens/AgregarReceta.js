import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import colors from "../styles/colors";
import ip from "../utils/myIP";
import { Container } from "../components/container";
import { LineaHorizontal } from "../components/linea";
import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function HomeScreen({ navigation }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [consultarModalVisible, setConsultarModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchCitasMedico = async () => {
      try {
        const medicoIDString = await AsyncStorage.getItem(
          "usuarioMedicoID"
        );
        const MedicoID = parseInt(medicoIDString);
        if (!MedicoID) return;

        const response = await fetch(
          `http://${ip}:3000/medAppointments/getMedAppointments?medicId=${MedicoID}`
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

    fetchCitasMedico();
  }, []);

  const handleConsultar = async (selectedAppointment) => {
    console.log("Consulta iniciada");
    setConsultarModalVisible(false);
    
    navigation.navigate("ConsultarMedico", {
      id_paciente: selectedAppointment.id_paciente,
      id_cita: selectedAppointment.id_cita,
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/ProSalud_logo.jpg")}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Próximas consultas</Text>
        </View>
      </View>

      <LineaHorizontal></LineaHorizontal>

      <ScrollView style={styles.content}>
        <Container style={styles.appointmentsContainer}>
          {
            //ESTE APPOINTEMNT SIRVE PARA VER COMO FUNCIONA EL CONTAINER Y QUE LOS DATOS SE MUESTREN EN EL SCROLLVIEW

            appointments.map((appointment) => (
              <View key={appointment.id_cita} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDate}>
                    {appointment.date} | {appointment.time}
                  </Text>
                </View>
                <Text style={styles.appointmentLocation}>
                  {appointment.paciente}
                </Text>
                <Text style={styles.appointmentLocation}>
                  {appointment.clinic}
                </Text>
                <Text style={styles.appointmentDoctor}>
                  {appointment.consultorio}
                </Text>


                <View style={styles.appointmentActions}>
                  <TouchableOpacity style={styles.detallesButton}>
                    <Text style={styles.detallesButtonText}>Ver detalles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.consultarButton} onPress={() => {
                    setSelectedAppointment(appointment);
                    setConsultarModalVisible(true);
                  }}>
                    <Text style={styles.consultarButtonText}>Iniciar consulta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </Container>
      </ScrollView>

      <TouchableOpacity style={styles.contactButton}>
        <Image
          source={require("../assets/telefono.png")}
          style={{ width: 20, height: 20 }}
        />
        <Text style={styles.contactButtonText}>Contactar Clínica</Text>
      </TouchableOpacity>
      
      <Modal
        visible={consultarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConsultarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <Text style={styles.logoutModalTitle}>Iniciar consulta</Text>
            <Text style={styles.logoutModalText}>
              ¿Está seguro que desea iniciar la consulta?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalNoButton]}
                onPress={() => setConsultarModalVisible(false)}
              >
                <Text style={styles.logoutModalNoText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalYesButton]}
                onPress={() => {
                  setConsultarModalVisible(false);
                  handleConsultar(selectedAppointment);
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
        <TouchableOpacity style={styles.tabItem}>
          <Image
            source={require("../assets/usuario.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.tabText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image
            source={require("../assets/configuracion.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.tabText}>Ajustes</Text>
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
    marginBottom: 5,
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
  detallesButton: {
    padding: 8,
  },
  detallesButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  consultarButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  consultarButtonText: {
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
    backgroundColor: colors.primary,
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

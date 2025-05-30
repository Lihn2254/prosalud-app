import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import colors from "../styles/colors";
import ip from "../utils/myIP";
import { Container } from "../components/container";
import { useState } from "react";
import { Alert } from "react-native";
export default function CancelarCita({ navigation, route }) {
  const { appointment } = route.params; // Recibe la cita a Cancelar

  // Estados pre-llenados con los datos de la cita
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [notes, setNotes] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelAppointment = async (appointmentId) => {
    try {
        const response = await fetch(`http://${ip}:3000/appointments/cancelAppointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId }), // Envía solo el ID
        });
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al cancelar la cita");
        }

        const result = await response.text(); // Lee la respuesta como texto
        alert(result); // Muestra "Cita cancelada" o el error
        navigation.navigate("HomeScreen");
    } catch (error) {
        alert("Error al conectar con el servidor");
        console.error(error);
    }
  };

  const isRefundable = () => {
  // 1. Parseamos la fecha de la cita (formato "26 de mayo de 2025")
  const [dia, mes, año] = appointment.date.split(' de ');
  const meses = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  };
  
  const fechaCita = new Date(año, meses[mes.toLowerCase()], dia);
  
  // 2. Fecha actual (sin horas/minutos/segundos)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // 3. Diferencia en días
  const diffDias = (fechaCita - hoy) / (1000 * 60 * 60 * 24);
  
  return diffDias >= 2; // True si hay 2 o más días de diferencia
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cancelar Cita</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Cita a Cancelar */}
      <ScrollView style={styles.content}>
        {/* Sección: Información Actual */}
        <Container style={styles.appointmentInfo}>
        {
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentDate}>
                    {appointment.date} | {appointment.time}
                </Text>
            </View>
            <Text style={styles.appointmentLocation}>{appointment.clinic}</Text>
            <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
          </View>
        }
        </Container>

        {/* Sección: advertencia */}

        {isRefundable() ? 
        <Container style={styles.confirmButton}>
        {
          <View style={styles.appointmentInfo}>
                <Text style={styles.warningText}>
                  ✅ Esta cancelación es aplicable para reembolso
                </Text>
          </View>
        }
        </Container> :
        <Container style={styles.warningContainer}>
        {
          <View style={styles.appointmentInfo}>
                <Text style={styles.warningText}>
                  ⚠️ Esta cancelación NO es aplicable para reembolso (menos de 2 días)
                </Text>
          </View>
        }
        </Container>}

        {/* Botón de Guardar */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => handleCancelAppointment(appointment.id)}
        >
          <Text style={styles.confirmButtonText}>Confirmar Cancelación</Text>
        </TouchableOpacity>

        {/* Botón de Cancelar Cita */}
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require("../assets/FlechaIzquierdaN.png")} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (combinación de los existentes + nuevos)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  currentAppointment: {
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 10,
  },
  currentText: {
    fontSize: 15,
    color: colors.text,
    marginVertical: 3,
  },
  specialtyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  specialtyCard: {
    width: "48%",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    alignItems: "center",
  },
  specialtyCardSelected: {
    backgroundColor: colors.primary,
  },
  specialtyText: {
    fontSize: 14,
    color: colors.text,
  },
  specialtyTextSelected: {
    color: colors.white,
    fontWeight: "bold",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    backgroundColor: colors.white,
  },
  dateSelectorText: {
    fontSize: 16,
    color: colors.text,
  },
  dateSelectorIcon: {
    fontSize: 20,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeSlot: {
    width: "30%",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
  },
  timeTextSelected: {
    color: colors.white,
    fontWeight: "bold",
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    height: 100,
    textAlignVertical: "top",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 17,
    alignItems: "center",
    marginVertical: 10,
    marginButton: 5, 
  },
  cancelButton: {
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    padding: 17,
    alignItems: "center",
    marginVertical: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 16,
  },
  warningContainer: {
    backgroundColor: '#e22f2f',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e22f2f',
  },
  warningText: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#fff',
    marginBottom: 5,
  },
});
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import colors from "../styles/colors";
import { Container } from "../components/container";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { LineaHorizontal } from "../components/linea";
import Modal from "react-native-modal";

export default function ModificarCita({ navigation, route }) {
  const { appointment } = route.params; // Recibe la cita a modificar

  // Estados pre-llenados con los datos de la cita
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [notes, setNotes] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modificar Cita</Text>
        <View style={{ width: 60 }} />
      </View>


      <ScrollView style={styles.content}>
        {/* Sección: Información Actual */}
        <Container style={styles.section}>
        {/* Sección: Nueva Fecha */}
          <Text style={styles.sectionTitle}>Fecha</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setCalendarVisible(true)}
          >
            <Text style={styles.dateSelectorText}>
              {selectedDate || "Seleccionar fecha"}
            </Text> 
            <Text style={styles.dateSelectorIcon}>📅</Text>
          </TouchableOpacity>

        

        {/* Sección: Nuevo Horario */}
          <Text style={styles.sectionTitle}>Horario</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        {/* Sección: Médico */}
          <Text style={styles.sectionTitle}>Médico</Text>
            <TouchableOpacity
            style={styles.dateSelector} disabled>
            <Text style={styles.specialtyText}>{appointment.doctor}</Text>
            <Text style={styles.dateSelectorIcon}>🩺</Text>
          </TouchableOpacity>

        {/* Sección: Clinica */}
        <Text style={styles.sectionTitle}>Clinica</Text>
            <TouchableOpacity
            style={styles.dateSelector} disabled>
            <Text style={styles.specialtyText}>{appointment.clinic}</Text>
            <Text style={styles.dateSelectorIcon}>🏥</Text>
          </TouchableOpacity>
        </Container>

        {/* Botón de Guardar */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => setShowSaveModal(true)}
        >
          <Text style={styles.confirmButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        {/* Botón de Cancelar Cita */}
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.navigate('CancelarCita', { appointment })}
        >
          <Text style={styles.confirmButtonText}>Cancelar Cita</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal del Calendario */}
      <Modal
        isVisible={calendarVisible}
        onBackdropPress={() => setCalendarVisible(false)}
        backdropColor="black"
        backdropOpacity={0.3}
      >
        <View style={styles.calendarPopover}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCalendarVisible(false);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
          />
        </View>
      </Modal>

      {/* Modal para Guardar */}
        <Modal isVisible={showSaveModal} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar cambios</Text>
            <Text style={styles.modalText}>¿Guardar los cambios en esta cita?</Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowSaveModal(false)}
            >
                <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => {
                setShowSaveModal(false);
                navigation.goBack();
                }}
            >
                <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>

        {/* Modal para Cancelar */}
        <Modal isVisible={showCancelModal} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancelar cita</Text>
            <Text style={styles.modalText}>¿Estás seguro de cancelar esta cita?</Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity 
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => setShowCancelModal(false)}
            >
                <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                setShowCancelModal(false);
                navigation.goBack();
                }}
            >
                <Text style={styles.modalButtonText}>Sí</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>

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
    backgroundColor: '#e22f2f',
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
  calendarPopover: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignSelf: "center",
  },
  modalContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  alignItems: "center",
  },
  modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
  marginBottom: 10,
  },
  modalText: {
  fontSize: 16,
  color: colors.textSecondary,
  marginBottom: 20,
  textAlign: "center",
  },
  modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  },
  modalButton: {
  borderRadius: 8,
  padding: 12,
  width: "48%",
  alignItems: "center",
  },
  modalCancelButton: {
  backgroundColor: "#e22f2f",
  },
  modalConfirmButton: {
  backgroundColor: colors.primary,
  },
  modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: "bold",
  },
});
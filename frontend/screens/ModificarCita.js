"use client"

import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import colors from "../styles/colors"
import { LineaHorizontal } from "../components/linea"
import { Calendar } from "react-native-calendars"
import { useState } from "react"
import Modal from "react-native-modal"

export default function ModificarCita({ navigation, route }) {
  const { appointment } = route.params

  // Estados pre-llenados con los datos de la cita
  const [selectedSpecialty, setSelectedSpecialty] = useState(appointment.specialty || "Cardiología")
  const [selectedConsultorio, setSelectedConsultorio] = useState("Consultorio 1")
  const [selectedUbicacion, setSelectedUbicacion] = useState(appointment.clinic)
  const [selectedDate, setSelectedDate] = useState(appointment.date)
  const [selectedTime, setSelectedTime] = useState(appointment.time)

  // Modal states
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false)
  const [consultorioModalVisible, setConsultorioModalVisible] = useState(false)
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const specialties = [
    "Medicina General",
    "Cardiología",
    "Dermatología",
    "Ginecología",
    "Pediatría",
    "Neurología",
    "Oftalmología",
    "Traumatología",
  ]

  const consultorios = ["Consultorio 1", "Consultorio 2", "Consultorio 3", "Consultorio 4", "Consultorio 5"]

  const ubicaciones = ["Clínica - Colinas de San Miguel", "Clínica - Centro", "Clínica - Norte", "Clínica - Sur"]

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
  ]

  const selectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty)
    setSpecialtyModalVisible(false)
  }

  const selectConsultorio = (consultorio) => {
    setSelectedConsultorio(consultorio)
    setConsultorioModalVisible(false)
  }

  const selectUbicacion = (ubicacion) => {
    setSelectedUbicacion(ubicacion)
    setUbicacionModalVisible(false)
  }

  const selectTime = (time) => {
    setSelectedTime(time)
    setTimeModalVisible(false)
  }

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

      <LineaHorizontal />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Appointment Info */}
        <View style={styles.currentInfoContainer}>
          <Text style={styles.currentInfoTitle}>Cita Actual</Text>
          <Text style={styles.currentInfoText}>Doctor: {appointment.doctor}</Text>
          <Text style={styles.currentInfoText}>
            Fecha: {appointment.date} | {appointment.time}
          </Text>
        </View>

        {/* Specialty Dropdown */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setSpecialtyModalVisible(true)}>
          <Text style={[styles.dropdownText, selectedSpecialty && styles.dropdownTextSelected]}>
            {selectedSpecialty || "Especialidad"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Consultorio Dropdown */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setConsultorioModalVisible(true)}>
          <Text style={[styles.dropdownText, selectedConsultorio && styles.dropdownTextSelected]}>
            {selectedConsultorio || "Consultorio"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Ubicación Dropdown */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setUbicacionModalVisible(true)}>
          <Text style={[styles.dropdownText, selectedUbicacion && styles.dropdownTextSelected]}>
            {selectedUbicacion || "Ubicación"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Date Selection */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setCalendarVisible(true)}>
          <Text style={[styles.dropdownText, selectedDate && styles.dropdownTextSelected]}>
            {selectedDate ? selectedDate : "Seleccionar fecha"}
          </Text>
          <Text style={styles.dropdownIcon}>📅</Text>
        </TouchableOpacity>

        {/* Time Selection */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setTimeModalVisible(true)}>
          <Text style={[styles.dropdownText, selectedTime && styles.dropdownTextSelected]}>
            {selectedTime ? `Horario: ${selectedTime}` : "Seleccionar horario"}
          </Text>
          <Text style={styles.dropdownIcon}>🕐</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.saveButton} onPress={() => setShowSaveModal(true)}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("CancelarCita", { appointment })}
        >
          <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
        </TouchableOpacity>

        {/* Modals */}
        {/* Specialty Modal */}
        <Modal
          isVisible={specialtyModalVisible}
          onBackdropPress={() => setSpecialtyModalVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0.5}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
            <ScrollView style={styles.optionsList}>
              {specialties.map((specialty, index) => (
                <TouchableOpacity key={index} style={styles.modalOption} onPress={() => selectSpecialty(specialty)}>
                  <Text style={styles.modalOptionText}>{specialty}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Consultorio Modal */}
        <Modal
          isVisible={consultorioModalVisible}
          onBackdropPress={() => setConsultorioModalVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0.5}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Consultorio</Text>
            <ScrollView style={styles.optionsList}>
              {consultorios.map((consultorio, index) => (
                <TouchableOpacity key={index} style={styles.modalOption} onPress={() => selectConsultorio(consultorio)}>
                  <Text style={styles.modalOptionText}>{consultorio}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Ubicación Modal */}
        <Modal
          isVisible={ubicacionModalVisible}
          onBackdropPress={() => setUbicacionModalVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0.5}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
            <ScrollView style={styles.optionsList}>
              {ubicaciones.map((ubicacion, index) => (
                <TouchableOpacity key={index} style={styles.modalOption} onPress={() => selectUbicacion(ubicacion)}>
                  <Text style={styles.modalOptionText}>{ubicacion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Time Modal */}
        <Modal
          isVisible={timeModalVisible}
          onBackdropPress={() => setTimeModalVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0.5}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Horario</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.timeSlot, selectedTime === time && styles.timeSlotSelected]}
                  onPress={() => selectTime(time)}
                >
                  <Text style={[styles.timeText, selectedTime === time && styles.timeTextSelected]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Calendar Modal */}
        <Modal
          isVisible={calendarVisible}
          onBackdropPress={() => setCalendarVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0.5}
        >
          <View style={styles.calendarModalContent}>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString)
                setCalendarVisible(false)
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                },
              }}
              minDate={new Date().toISOString().split("T")[0]}
            />
          </View>
        </Modal>

        {/* Save Confirmation Modal */}
        <Modal isVisible={showSaveModal} backdropOpacity={0.5}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>Confirmar cambios</Text>
            <Text style={styles.confirmModalText}>¿Guardar los cambios en esta cita?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.confirmModalCancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.confirmModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.confirmModalSaveButton]}
                onPress={() => {
                  setShowSaveModal(false)
                  navigation.goBack()
                }}
              >
                <Text style={styles.confirmModalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    paddingTop: 20,
  },
  currentInfoContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  currentInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  currentInfoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: "#999999",
  },
  dropdownTextSelected: {
    color: "#333333",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#666666",
  },
  dropdownIcon: {
    fontSize: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E53E3E",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  cancelButtonText: {
    color: "#E53E3E",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Modal Styles
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
  },
  optionsList: {
    maxHeight: 300,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333333",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  timeSlot: {
    width: "30%",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: "#333333",
  },
  timeTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  calendarModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    width: "90%",
    alignSelf: "center",
  },
  // Confirmation Modal
  confirmModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginHorizontal: 20,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  confirmModalText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 25,
    textAlign: "center",
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmModalButton: {
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  confirmModalCancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  confirmModalSaveButton: {
    backgroundColor: colors.primary,
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

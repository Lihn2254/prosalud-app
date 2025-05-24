import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import colors from "../styles/colors"
import { Container } from "../components/container"
import { LineaHorizontal } from "../components/linea"
import { Calendar } from "react-native-calendars"
import { useState } from "react"

export default function ScheduleAppointmentScreen({ navigation }) {
  
  const [selectedSpecialty, setSelectedSpecialty] = useState("")


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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Nueva Cita</Text>
        <View style={{ width: 60 }} />
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content}>
        {/* Patient Information */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Paciente</Text>
          <LineaHorizontal />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su nombre completo"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula de Identidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su cédula"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su teléfono"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </Container>

        {/* Specialty Selection */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Especialidad</Text>
          <LineaHorizontal />

          <View style={styles.specialtyGrid}>
            {specialties.map((specialty, index) => {
                        const isSelected = selectedSpecialty === specialty
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.specialtyCard,
                              isSelected && styles.specialtyCardSelected
                            ]}
                            onPress={() => setSelectedSpecialty(specialty)}
                          >
                            <Text style={[
                              styles.specialtyText,
                              isSelected && styles.specialtyTextSelected
                            ]}>
                              {specialty}
                            </Text>
                          </TouchableOpacity>
                      )
                    })}
          </View>
        </Container>

        {/* Date Selection */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Fecha</Text>
          <LineaHorizontal />

          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateSelectorText}>Seleccionar fecha</Text>
            <Text style={styles.dateSelectorIcon}>📅</Text>
          </TouchableOpacity>
        </Container>

        {/* Time Selection */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
          <LineaHorizontal />

          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity key={index} style={styles.timeSlot}>
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Container>

        {/* Additional Notes */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones (Opcional)</Text>
          <LineaHorizontal />

          <TextInput
            style={styles.textArea}
            placeholder="Describa el motivo de su consulta o alguna observación especial"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </Container>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
        </TouchableOpacity>
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
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
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
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
  },

  specialtyCardSelected: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
},

specialtyTextSelected: {
  color: colors.white,
  fontWeight: "bold",
},

  specialtyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
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
    color: colors.textSecondary,
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
    padding: 12,
    marginVertical: 5,
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
})

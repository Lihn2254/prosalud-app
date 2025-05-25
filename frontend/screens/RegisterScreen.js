"use client"

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native"
import colors from "../styles/colors"
import { Container } from "../components/container"
import { LineaHorizontal } from "../components/linea"
import { useState } from "react"

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: "",
    segundoNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [yearPickerVisible, setYearPickerVisible] = useState(false)
  const [genderModalVisible, setGenderModalVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Calendar state
  const [selectedYear, setSelectedYear] = useState(1990)
  const [selectedMonth, setSelectedMonth] = useState(0) // 0-11
  const [selectedDay, setSelectedDay] = useState(1) // 1-31

  const genderOptions = ["Masculino", "Femenino", "Otro"]

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      genero,
      fechaNacimiento,
      telefono,
      email,
      password,
      confirmPassword,
    } = formData

    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es requerido")
      return false
    }

    if (!apellidoPaterno.trim()) {
      Alert.alert("Error", "El apellido paterno es requerido")
      return false
    }

    if (!apellidoMaterno.trim()) {
      Alert.alert("Error", "El apellido materno es requerido")
      return false
    }

    if (!genero) {
      Alert.alert("Error", "Por favor selecciona tu género")
      return false
    }

    if (!fechaNacimiento) {
      Alert.alert("Error", "La fecha de nacimiento es requerida")
      return false
    }

    if (!telefono.trim() || telefono.length < 10) {
      Alert.alert("Error", "Por favor ingresa un número de teléfono válido")
      return false
    }

    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido")
      return false
    }

    if (!password.trim() || password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return false
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return false
    }

    return true
  }

  const handleRegister = () => {
    if (validateForm()) {
      Alert.alert("Registro Exitoso", "Tu cuenta ha sido creada exitosamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ])
    }
  }

  const selectGender = (gender) => {
    updateFormData("genero", gender)
    setGenderModalVisible(false)
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year)
    }
    return years
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const days = []
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const openYearPicker = () => {
    if (formData.fechaNacimiento) {
      const date = new Date(formData.fechaNacimiento)
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
      setSelectedDay(date.getDate())
    } else {
      const reasonableYear = new Date().getFullYear() - 25
      setSelectedYear(reasonableYear)
      setSelectedMonth(0)
      setSelectedDay(1)
    }
    setYearPickerVisible(true)
  }

  // Update selected day when month or year changes to ensure valid day
  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    const daysInNewMonth = getDaysInMonth(selectedYear, month)
    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth)
    }
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    const daysInNewMonth = getDaysInMonth(year, selectedMonth)
    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth)
    }
  }

  const confirmDateSelection = () => {
    // Create date string in YYYY-MM-DD format
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    updateFormData("fechaNacimiento", dateString)
    setYearPickerVisible(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro</Text>
        <View style={{ width: 60 }} />
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Container style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <LineaHorizontal />

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(text) => updateFormData("nombre", text)}
              autoCapitalize="words"
            />
          </View>

          {/* Segundo Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Segundo Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu segundo nombre (opcional)"
              placeholderTextColor="#999"
              value={formData.segundoNombre}
              onChangeText={(text) => updateFormData("segundoNombre", text)}
              autoCapitalize="words"
            />
          </View>

          {/* Apellido Paterno */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido Paterno *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu apellido paterno"
              placeholderTextColor="#999"
              value={formData.apellidoPaterno}
              onChangeText={(text) => updateFormData("apellidoPaterno", text)}
              autoCapitalize="words"
            />
          </View>

          {/* Apellido Materno */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido Materno *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu apellido materno"
              placeholderTextColor="#999"
              value={formData.apellidoMaterno}
              onChangeText={(text) => updateFormData("apellidoMaterno", text)}
              autoCapitalize="words"
            />
          </View>

          {/* Género */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Género *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setGenderModalVisible(true)}>
              <Text style={[styles.dropdownText, formData.genero && styles.dropdownTextSelected]}>
                {formData.genero || "Selecciona tu género"}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Fecha de Nacimiento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento *</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={openYearPicker}>
              <Text style={[styles.dateSelectorText, formData.fechaNacimiento && styles.dateSelectorTextSelected]}>
                {formData.fechaNacimiento
                  ? formData.fechaNacimiento.split("-").reverse().join("/")
                  : "Seleccionar fecha"}
              </Text>
              <Text style={styles.dateSelectorIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Teléfono */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Teléfono *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de teléfono"
              placeholderTextColor="#999"
              value={formData.telefono}
              onChangeText={(text) => updateFormData("telefono", text)}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => updateFormData("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirma tu contraseña"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData("confirmPassword", text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={styles.eyeText}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Container>

        {/* Gender Modal */}
        <Modal
          visible={genderModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setGenderModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Género</Text>
              <ScrollView style={styles.optionsList}>
                {genderOptions.map((gender, index) => (
                  <TouchableOpacity key={index} style={styles.modalOption} onPress={() => selectGender(gender)}>
                    <Text style={styles.modalOptionText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setGenderModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Year/Month/Day Picker Modal */}
        <Modal
          visible={yearPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setYearPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.yearPickerModal}>
              <Text style={styles.modalTitle}>Seleccionar Fecha</Text>

              {/* Year Selection */}
              <Text style={styles.pickerLabel}>Año: {selectedYear}</Text>
              <ScrollView style={styles.yearScrollView} showsVerticalScrollIndicator={true}>
                {generateYears().map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.yearOption, selectedYear === year && styles.yearOptionSelected]}
                    onPress={() => handleYearChange(year)}
                  >
                    <Text style={[styles.yearOptionText, selectedYear === year && styles.yearOptionTextSelected]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Month Selection */}
              <Text style={styles.pickerLabel}>Mes: {months[selectedMonth]}</Text>
              <ScrollView horizontal style={styles.monthScrollView} showsHorizontalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.monthOption, selectedMonth === index && styles.monthOptionSelected]}
                    onPress={() => handleMonthChange(index)}
                  >
                    <Text style={[styles.monthOptionText, selectedMonth === index && styles.monthOptionTextSelected]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Day Selection */}
              <Text style={styles.pickerLabel}>Día: {selectedDay}</Text>
              <ScrollView horizontal style={styles.dayScrollView} showsHorizontalScrollIndicator={false}>
                {generateDays().map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayOption, selectedDay === day && styles.dayOptionSelected]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[styles.dayOptionText, selectedDay === day && styles.dayOptionTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.pickerActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setYearPickerVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDateSelection}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
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
    color: "#333333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: "#999",
  },
  dropdownTextSelected: {
    color: "#333333",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666666",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
  },
  dateSelectorText: {
    fontSize: 16,
    color: "#999",
  },
  dateSelectorTextSelected: {
    color: "#333333",
  },
  dateSelectorIcon: {
    fontSize: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333333",
  },
  eyeButton: {
    padding: 12,
  },
  eyeText: {
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginLinkText: {
    fontSize: 14,
    color: "#666666",
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
  },
  optionsList: {
    maxHeight: 200,
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
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#666666",
    fontSize: 16,
  },
  // Year/Month/Day Picker Styles
  yearPickerModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginVertical: 10,
  },
  yearScrollView: {
    maxHeight: 150,
    marginBottom: 15,
  },
  yearOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  yearOptionSelected: {
    backgroundColor: colors.primary,
  },
  yearOptionText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
  yearOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  monthScrollView: {
    marginBottom: 15,
  },
  monthOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    minWidth: 70,
    alignItems: "center",
  },
  monthOptionSelected: {
    backgroundColor: colors.primary,
  },
  monthOptionText: {
    fontSize: 12,
    color: "#666666",
  },
  monthOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  // Day Selection Styles
  dayScrollView: {
    marginBottom: 20,
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    minWidth: 35,
    alignItems: "center",
  },
  dayOptionSelected: {
    backgroundColor: colors.primary,
  },
  dayOptionText: {
    fontSize: 14,
    color: "#666666",
  },
  dayOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

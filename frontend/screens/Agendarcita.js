"use client";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import colors from "../styles/colors";
import { LineaHorizontal } from "../components/linea";
import { Calendar } from "react-native-calendars";
import { useState, useEffect } from "react";
import Modal from "react-native-modal";

export default function ScheduleAppointmentScreen({ navigation }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedConsultorio, setSelectedConsultorio] = useState("");
  const [selectedUbicacion, setSelectedUbicacion] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [consultorioModalVisible, setConsultorioModalVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.12:3000/medical/getDoctors"
        );
        if (!response.ok) throw new Error("Error al obtener los doctores");

        const data = await response.json();
        setAvailableDoctors(data);
      } catch (error) {
        console.error("Error en fetch:", error);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = [
    "Oftalmología",
    "Urologia",
    "Endocrinología",
    "Psiquiatría",
    "Ortopedia",
    "Ginecología y Obstetricia",
    "Neurología",
    "Oncología",
    "Pediatria",
    "Cardiologia",
    "Dermatologia",
  ];
  const consultorios = [
    "Consultorio 1",
    "Consultorio 2",
    "Consultorio 3",
    "Consultorio 4",
    "Consultorio 5",
  ];

  const ubicaciones = [
    "Clínica - Colinas de San Miguel",
    "Clínica - Centro",
    "Clínica - Norte",
    "Clínica - Sur",
  ];

  /*

  const availableDoctors = [
    {
      id: 1,
      name: "Dra. Ana García López",
      specialty: "Cardiología",
      timeSlot: "13:00 - 14:00",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Javier Lizárraga Moreno",
      specialty: "Cardiología",
      timeSlot: "16:00 - 17:00",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Carlos Mendoza",
      specialty: "Medicina General",
      timeSlot: "09:00 - 10:00",
      available: true,
    },
    {
      id: 4,
      name: "Dra. María Rodríguez",
      specialty: "Dermatología",
      timeSlot: "15:00 - 16:00",
      available: true,
    },
  ]
    */

  const filteredDoctors = availableDoctors.filter(
    (doctor) => !selectedSpecialty || doctor.specialty === selectedSpecialty
  );

  const showDoctors =
    selectedSpecialty &&
    selectedConsultorio &&
    selectedUbicacion &&
    selectedDate;

  const selectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    setSpecialtyModalVisible(false);
  };

  const selectConsultorio = (consultorio) => {
    setSelectedConsultorio(consultorio);
    setConsultorioModalVisible(false);
  };

  const selectUbicacion = (ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setUbicacionModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Cita</Text>
        <View style={{ width: 60 }} />
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content}>
        {/* Specialty Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setSpecialtyModalVisible(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedSpecialty && styles.dropdownTextSelected,
            ]}
          >
            {selectedSpecialty || "Especialidad"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Consultorio Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setConsultorioModalVisible(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedConsultorio && styles.dropdownTextSelected,
            ]}
          >
            {selectedConsultorio || "Consultorio"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Ubicación Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setUbicacionModalVisible(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedUbicacion && styles.dropdownTextSelected,
            ]}
          >
            {selectedUbicacion || "Ubicación"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Date Selection */}
        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setCalendarVisible(true)}
        >
          <Text
            style={[
              styles.dateSelectorText,
              selectedDate && styles.dateSelectorTextSelected,
            ]}
          >
            {selectedDate
              ? selectedDate.split("-").reverse().join("/")
              : "Seleccionar fecha"}
          </Text>
          <Text style={styles.dateSelectorIcon}>📅</Text>
        </TouchableOpacity>

        {/* Available Doctors */}
        {showDoctors && (
          <View style={styles.doctorsContainer}>
            {filteredDoctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorTime}>{doctor.timeSlot}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Specialty Modal */}
        <Modal
          isVisible={specialtyModalVisible}
          onBackdropPress={() => setSpecialtyModalVisible(false)}
          style={styles.modalContainer}
          backdropOpacity={0}
          hasBackdrop={false}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
            <ScrollView style={styles.optionsList}>
              {specialties.map((specialty, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => selectSpecialty(specialty)}
                >
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
          backdropOpacity={0}
          hasBackdrop={false}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Consultorio</Text>
            <ScrollView style={styles.optionsList}>
              {consultorios.map((consultorio, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => selectConsultorio(consultorio)}
                >
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
          backdropOpacity={0}
          hasBackdrop={false}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
            <ScrollView style={styles.optionsList}>
              {ubicaciones.map((ubicacion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => selectUbicacion(ubicacion)}
                >
                  <Text style={styles.modalOptionText}>{ubicacion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Calendar Modal */}
        <Modal
          isVisible={calendarVisible}
          onBackdropPress={() => setCalendarVisible(false)}
          style={styles.calendarModalContainer}
          backdropOpacity={0}
          hasBackdrop={false}
          animationIn="fadeIn"
          animationOut="fadeOut"
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
              minDate={new Date().toISOString().split("T")[0]}
            />
          </View>
        </Modal>
      </ScrollView>

      {/* Bottom Navigation */}
      <LineaHorizontal />
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
          <Text style={styles.tabText}>Mi Salud</Text>
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
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: "#666666",
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
    marginBottom: 20,
  },
  dateSelectorText: {
    fontSize: 16,
    color: "#666666",
  },
  dateSelectorTextSelected: {
    color: "#333333",
  },
  dateSelectorIcon: {
    fontSize: 20,
  },
  doctorsContainer: {
    marginTop: 10,
  },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  doctorInfo: {
    marginBottom: 10,
  },
  doctorTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 14,
    color: "#666666",
  },
  addButton: {
    backgroundColor: "#333",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    opacity: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
  optionsList: {
    maxHeight: 300,
    backgroundColor: "#FFFFFF",
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333333",
    backgroundColor: "transparent",
  },
  calendarModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  calendarPopover: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    opacity: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#333333",
  },
  activeTabText: {
    color: colors.primary,
  },
});

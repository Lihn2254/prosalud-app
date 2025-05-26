"use client";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import colors from "../styles/colors";
import { LineaHorizontal } from "../components/linea";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart, BarChart } from "react-native-chart-kit";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import ip from "../utils/myIP";

export default function AdminDashboardScreen({ navigation }) {
  // Estados para las estadísticas
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    canceledAppointments: 0,
    newPatients: 0,
    revenue: 0,
  });

  // Estados para los reportes
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({
    type: "financial",
    dateFrom: "",
    dateTo: "",
    specialty: "",
  });

  // Estados para la asignación de consultorios
  const [doctors, setDoctors] = useState([]);
  const [consultorios, setConsultorios] = useState([
    "Consultorio 1",
    "Consultorio 2",
    "Consultorio 3",
    "Consultorio 4",
    "Consultorio 5",
  ]);
  const [sucursales] = useState(["Norte", "Sur"]);
  const [horarios] = useState([
    "8:00 - 9:00",
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedConsultorio, setSelectedConsultorio] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [selectedHorario, setSelectedHorario] = useState("");

  // Especialidades para filtros
  const specialties = [
    "Todas",
    "Oftalmología",
    "Urologia",
    "Endocrinología",
    "Psiquiatría",
    "Ortopedia",
    "Ginecología",
    "Neurología",
    "Oncología",
    "Pediatria",
    "Cardiologia",
    "Dermatologia",
  ];

  useEffect(() => {
    fetchStats();
    fetchDoctors();
    fetchReports();
  }, [filter]);

  const fetchStats = async () => {
    try {
      // Simulación de datos - en una app real harías una llamada API
      setStats({
        totalAppointments: 342,
        completedAppointments: 298,
        canceledAppointments: 44,
        newPatients: 67,
        revenue: 125430,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchDoctors = async () => {
    const apiUrl = `http://${ip}:3000/admin/getDoctorsAdmin`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errorResponse = await response.json();
          errorDetail =
            errorResponse.detail ||
            errorResponse.error ||
            errorResponse.message ||
            errorDetail;
        } catch (e) {}
        throw new Error(
          `Error al obtener los doctores. Estado: ${response.status}. Detalle: ${errorDetail}`
        );
      }

      const doctorsData = await response.json();

      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error.message);
    }
  };

  const fetchReports = async () => {
    try {
      // Simulación de datos basados en filtros
      let mockReports = [];

      if (filter.type === "financial") {
        mockReports = [
          {
            id: 1,
            title: "Ingresos totales",
            value: "$125,430",
            change: "+12%",
          },
          { id: 2, title: "Consultas realizadas", value: "298", change: "+8%" },
          {
            id: 3,
            title: "Ingresos por especialidad",
            value: "Cardiología: $45,200",
            change: "+15%",
          },
        ];
      } else {
        mockReports = [
          { id: 1, title: "Nuevos pacientes", value: "67", change: "+5%" },
          {
            id: 2,
            title: "Distribución por edad",
            value: "18-35: 42%",
            change: "-3%",
          },
          {
            id: 3,
            title: "Procedimientos comunes",
            value: "Consulta general: 58%",
            change: "+2%",
          },
        ];
      }

      setReports(mockReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleAssignConsultorio = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedConsultorio(doctor.consultorio || "");
    setSelectedSucursal(doctor.sucursal || "");
    setSelectedHorario(doctor.horario || "");
    setAssignModalVisible(true);
  };

  const confirmAssignConsultorio = () => {
    // Actualizar el estado de los doctores con la nueva asignación
    setDoctors(
      doctors.map((doc) =>
        doc.id === selectedDoctor.id
          ? {
              ...doc,
              consultorio: selectedConsultorio,
              sucursal: selectedSucursal,
              horario: selectedHorario,
            }
          : doc
      )
    );
    setAssignModalVisible(false);

    // Aquí iría la llamada API para guardar el cambio en el backend
  };

  // Datos para gráficos
  const occupancyData = [
    {
      name: "Completado",
      population: stats.completedAppointments,
      color: colors.primary,
      legendFontColor: "#7F7F7F",
    },
    {
      name: "Cancelado",
      population: stats.canceledAppointments,
      color: "#FF6B6B",
      legendFontColor: "#7F7F7F",
    },
  ];

  const revenueData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [12000, 19000, 28000, 22000, 24000, 28000],
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
      </View>

      <LineaHorizontal />

      <ScrollView style={styles.content}>
        {/* Sección de Estadísticas */}
        <Text style={styles.sectionTitle}>Estadísticas de Ocupación</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Citas totales</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedAppointments}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.canceledAppointments}</Text>
            <Text style={styles.statLabel}>Canceladas</Text>
          </View>
        </View>

        {/* Gráficos */}
        <View style={styles.chartsContainer}>
          <Text style={styles.chartTitle}>Distribución de citas</Text>
          <PieChart
            data={occupancyData}
            width={Dimensions.get("window").width - 40}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Ingresos últimos 6 meses</Text>
          <BarChart
            data={revenueData}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>

        {/* Sección de Reportes */}
        <Text style={styles.sectionTitle}>Reportes</Text>

        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Tipo:</Text>
            <Picker
              selectedValue={filter.type}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setFilter({ ...filter, type: itemValue })
              }
            >
              <Picker.Item label="Financieros" value="financial" />
              <Picker.Item label="Demográficos" value="demographic" />
            </Picker>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Especialidad:</Text>
            <Picker
              selectedValue={filter.specialty}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setFilter({ ...filter, specialty: itemValue })
              }
            >
              {specialties.map((spec, index) => (
                <Picker.Item
                  key={index}
                  label={spec}
                  value={spec === "Todas" ? "" : spec}
                />
              ))}
            </Picker>
          </View>
        </View>

        <FlatList
          data={reports}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportValue}>{item.value}</Text>
              <Text
                style={[
                  styles.reportChange,
                  item.change.startsWith("+")
                    ? styles.positiveChange
                    : styles.negativeChange,
                ]}
              >
                {item.change}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Sección de Asignación de Consultorios */}
        <Text style={styles.sectionTitle}>Asignación de Consultorios</Text>

        <FlatList
          data={doctors}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.doctorCard}>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                {item.consultorio ? (
                  <>
                    <Text style={styles.doctorDetail}>
                      Sucursal: {item.sucursal || "No asignada"}
                    </Text>
                    <Text style={styles.doctorDetail}>
                      Consultorio: {item.consultorio}
                    </Text>
                    <Text style={styles.doctorDetail}>
                      Horario: {item.horario || "No asignado"}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.doctorConsultorio}>
                    Sin asignación completa
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => handleAssignConsultorio(item)}
              >
                <Text style={styles.assignButtonText}>Asignar</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>

      {/* Modal de Asignación de Consultorio */}
      <Modal isVisible={assignModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Asignar consultorio a {selectedDoctor?.name}
          </Text>

          {/* Selector de Sucursal */}
          <Text style={styles.modalLabel}>Sucursal:</Text>
          <Picker
            selectedValue={selectedSucursal}
            onValueChange={(itemValue) => setSelectedSucursal(itemValue)}
            style={styles.modalPicker}
          >
            <Picker.Item label="Seleccionar sucursal" value="" />
            {sucursales.map((sucursal, index) => (
              <Picker.Item
                key={`sucursal-${index}`}
                label={sucursal}
                value={sucursal}
              />
            ))}
          </Picker>

          {/* Selector de Consultorio */}
          <Text style={styles.modalLabel}>Consultorio:</Text>
          <Picker
            selectedValue={selectedConsultorio}
            onValueChange={(itemValue) => setSelectedConsultorio(itemValue)}
            style={styles.modalPicker}
          >
            <Picker.Item label="Seleccionar consultorio" value="" />
            {consultorios.map((consultorio, index) => (
              <Picker.Item
                key={`consultorio-${index}`}
                label={consultorio}
                value={consultorio}
              />
            ))}
          </Picker>

          {/* Selector de Horario */}
          <Text style={styles.modalLabel}>Horario:</Text>
          <Picker
            selectedValue={selectedHorario}
            onValueChange={(itemValue) => setSelectedHorario(itemValue)}
            style={styles.modalPicker}
          >
            <Picker.Item label="Seleccionar horario" value="" />
            {horarios.map((horario, index) => (
              <Picker.Item
                key={`horario-${index}`}
                label={horario}
                value={horario}
              />
            ))}
          </Picker>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setAssignModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmAssignConsultorio}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <LineaHorizontal />
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Image
            source={require("../assets/casa.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.tabText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image
            source={require("../assets/grafico.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={[styles.tabText, styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("LoginScreen")}
        >
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  chartsContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    marginTop: 15,
  },
  chart: {
    borderRadius: 10,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
  },
  picker: {
    flex: 1,
    height: 40,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 14,
    color: "#666",
  },
  reportValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 5,
  },
  reportChange: {
    fontSize: 14,
  },
  positiveChange: {
    color: "#4CAF50",
  },
  negativeChange: {
    color: "#F44336",
  },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666",
  },
  doctorConsultorio: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  doctorDetail: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  assignButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 10,
    paddingHorizontal: 15,
  },
  assignButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  modalPicker: {
    width: "100%",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 6,
    padding: 12,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontWeight: "bold",
    fontSize: 14,
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
    fontWeight: "bold",
  },
});

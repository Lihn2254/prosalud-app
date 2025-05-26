import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal
} from "react-native";
import colors from "../styles/colors";
import ip from "../utils/myIP";
import { LineaHorizontal } from "../components/linea";

export default function ConsultarMedico() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id_paciente, id_cita } = route.params;
    const [consulta, setConsulta] = useState({});
    const [diagnostico, setDiagnostico] = useState("");
    const [recetaModalVisible, setRecetaModalVisible] = useState(false);
    const [observaciones, setObservaciones] = useState("");
    const [recetaTexto, setRecetaTexto] = useState('');
    const [inputTemporal, setInputTemporal] = useState("");

    useEffect(() => {
        const fetchConsultaPaciente = async () => {
            try {
                const response = await fetch(`http://${ip}:3000/medAppointments/onGoingAppointment?id_cita=${id_cita}`);
                const data = await response.json();
                const info = Array.isArray(data) ? data[0] || {} : data;
                setConsulta(info);
                setDiagnostico(info.diagnostico || "");
                setObservaciones(info.observaciones || "");
            } catch (error) {
                console.error("Error al obtener la consulta:", error);
            }
        };
        fetchConsultaPaciente();
    }, [id_cita]);

    const handleGuardarConsulta = async (id_cita) => {
        try {
            const response = await fetch(
                `http://${ip}:3000/medAppointments/newAppointment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    //folioConsulta, id_cita, diagnostico, observaciones
                    body: JSON.stringify({
                        folioConsulta: Math.floor(100000 + Math.random() * 900000),
                        id_cita: consulta.id_cita,
                        nuevoDiagnostico: diagnostico,
                        nuevasObservaciones: observaciones,
                        recetaTexto: recetaTexto,
                    }),
                }
            );

            if (!response.ok) throw new Error("Error al guardar consulta");

            const result = await response.json();
            console.log("Consulta guardada", result);
            navigation.navigate("HomeMedico");
            //Alert.alert("Éxito", "Consulta guardada.");
        } catch (error) {
            console.error("Error al guardar los cambios en la base de datos: ", error)
        }
        Alert.alert("Éxito.", "Consulta guardada correctamente.");
        navigation.navigate("HomeMedico");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/ProSalud_logo.jpg")}
                        style={styles.logo}
                    />
                    <Text style={styles.headerText}>Consulta en curso</Text>
                </View>
            </View>

            <LineaHorizontal />

            <ScrollView style={styles.content}>
                <View style={styles.appointmentCard}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>ID Cita: </Text>
                        {consulta.id_cita}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>ID Paciente: </Text>
                        {consulta.id_paciente}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Paciente: </Text>
                        {consulta.paciente}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Edad: </Text>
                        {consulta.edad}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Genero: </Text>
                        {consulta.genero}
                    </Text>

                    <LineaHorizontal />

                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.detailFieldTitle}>Diagnóstico</Text>
                        <TextInput
                            style={styles.inputDiagnostico}
                            value={diagnostico}
                            onChangeText={setDiagnostico}
                            placeholder="Escribe el diagnóstico"
                            multiline
                        />
                        <Text style={styles.detailFieldTitle}>Motivo / Observaciones</Text>
                        <TextInput
                            style={styles.inputObservaciones}
                            value={observaciones}
                            onChangeText={setObservaciones}
                            placeholder="Escribe las observaciones"
                            multiline
                        />
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={recetaModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRecetaModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.recetaModalContent}>
                        <Text style={styles.recetaModalTitle}>Añadir receta</Text>

                        <TextInput
                            style={styles.recetaInput}
                            placeholder="Cuerpo de la receta"
                            value={inputTemporal}
                            onChangeText={setInputTemporal}
                            multiline
                        />

                        <View style={styles.recetaModalButtons}>
                            <TouchableOpacity
                                style={[styles.recetaModalButton, styles.cancelButton]}
                                onPress={() => {
                                    setInputTemporal("");
                                    setRecetaModalVisible(false)
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.recetaModalButton, styles.saveButton]}
                                onPress={() => {
                                    setRecetaTexto(inputTemporal);
                                    setRecetaModalVisible(false);
                                    Alert.alert("Éxito.", "Receta guardada.")
                                }}
                            >
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <TouchableOpacity style={styles.recetasButton} onPress={() => setRecetaModalVisible(true)}>
                <Text style={styles.sectionTitle}>Añadir receta</Text>
            </TouchableOpacity>

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.actionButtonText}>Atrás</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.finishButton}
                    onPress={handleGuardarConsulta}
                >
                    <Text style={styles.actionButtonText}>Terminar consulta</Text>
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
        marginTop: 50,
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
    appointmentCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 0,
        elevation: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
    },
    detailLabel: {
        fontWeight: "bold",
        color: colors.primary,
    },
    detailFieldTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 6,
        color: colors.primary,
    },
    detailText: {
        fontSize: 20,
        marginBottom: 6,
        color: colors.text,
    },
    inputDiagnostico: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },
    inputObservaciones: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        minHeight: 200,
        textAlignVertical: "top",
    },
    recetasButton: {
        backgroundColor: "white",
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 5,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 60,
    },
    finishButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 25,
        padding: 12,
        marginBottom: 30,
        minWidth: 170,
    },
    backButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#24272b",
        borderRadius: 25,
        padding: 12,
        marginBottom: 30,
        minWidth: 170,
    },
    actionButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
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
    recetaModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '85%',
    },
    recetaModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 5,
    },
    recetaInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 18,
        marginBottom: 20,
        minHeight: 200,
    },
    recetaModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    recetaModalButton: {
        flex: 1,
        padding: 10,
        borderRadius:20,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    cancelButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
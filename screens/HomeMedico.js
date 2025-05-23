
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import colors from '../styles/colors';
import { Container } from '../components/container';
import { LineaHorizontal } from '../components/linea';
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function HomeScreen({ navigation }) {
    const { usuario, setUsuario } = useContext(UserContext);
    const appointments = [
        {
            id: 1,
            date: "Abril 30, 2025",
            time: "13:00",
            clinic: "Clínica - Colinas de San Miguel",
            doctor: "Dra. Ana García López",
        },
        {
            id: 2,
            date: "Abril 30, 2025",
            time: "16:00",
            clinic: "Clínica - Colinas de San Miguel",
            doctor: "Dra. Ana García López",
        },
        {
            id: 3,
            date: "Abril 30, 2025",
            time: "16:00",
            clinic: "Clínica - Colinas de San Miguel",
            doctor: "Dra. Ana García López",
        },
        {
            id: 4,
            date: "Abril 30, 2025",
            time: "16:00",
            clinic: "Clínica - Colinas de San Miguel",
            doctor: "Dra. Ana García López",
        },
    ]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/ProSalud_logo.jpg")} style={styles.logo} />
                    <Text style={styles.headerText}>Próximas consultas</Text>
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
                                <Text style={styles.appointmentLocation}>{appointment.clinic}</Text>
                                <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>

                                <View style={styles.appointmentActions}>
                                    <TouchableOpacity style={styles.modifyButton}>
                                        <Text style={styles.modifyButtonText}>Modificar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.detailsButton}>
                                        <Text style={styles.detailsButtonText}>Ver detalles</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                </Container>
            </ScrollView>
            <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Agendar Nueva Cita</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton}>
                <Image source={require("../assets/telefono.png")} style={{ width: 20, height: 20 }} />
                <Text style={styles.contactButtonText}>Contactar Clínica</Text>
            </TouchableOpacity>


            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Image source={require("../assets/casa.png")} style={{ width: 20, height: 20 }} />
                    <Text style={[styles.tabText, styles.activeTabText]}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Image source={require("../assets/usuario.png")} style={{ width: 20, height: 20 }} />
                    <Text style={styles.tabText}>Mi Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Image source={require("../assets/configuracion.png")} style={{ width: 20, height: 20 }} />
                    <Text style={styles.tabText}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
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
        backgroundColor: '#ffffff',
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
})

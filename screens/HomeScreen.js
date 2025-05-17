import { SafeAreaView, View, Text } from "react-native";
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/*Agregar aquí el contenido de la pantalla principal
                El texto de abajo lo pueden borrar*/}
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>¡Bienvenido a Prosalud!</Text>
            </View>
        </SafeAreaView>
    );
}
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { UserProvider } from "./UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import HomeMedico from "./screens/HomeMedico";
import Agendarcita from "./screens/Agendarcita";
import ModificarCita from "./screens/ModificarCita";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="HomeMedico" component={HomeMedico} />
          <Stack.Screen name="Agendarcita" component={Agendarcita} />
          <Stack.Screen name="ModificarCita" component={ModificarCita} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

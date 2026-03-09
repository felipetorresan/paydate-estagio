import React, { useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider } from "./src/context/AuthContext";
import { StudentsProvider } from "./src/context/StudentsContext";

// Telas principais
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Administração
import HomeScreen from "./src/screens/HomeScreen";
import AddStudentScreen from "./src/screens/AddStudentScreen";
import EditStudentScreen from "./src/screens/EditStudentScreen";
import ViewScreen from "./src/screens/ViewScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ParcelScreen from "./src/screens/ParcelScreen"; // nova tela: enviar parcela
import ParcelPaymentScreen from "./src/screens/ParcelPaymentScreen"; // nova tela: detalhe da parcela
import AllPaymentsScreen from "./src/screens/AllPaymentsScreen";

// Usuário comum
import UserHomeScreen from "./src/screens/UserHomeScreen";
import UserViewScreen from "./src/screens/UserViewScreen";
import UserPaymentsScreen from "./src/screens/UserPaymentsScreen";

// Configurações de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listener de recebimento
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📩 Notificação recebida:", notification);
      });

    // Listener de clique
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Usuário clicou na notificação:", response);
      });

    // Cleanup seguro
    return () => {
      try {
        if (notificationListener.current?.remove) {
          notificationListener.current.remove();
        }
        if (responseListener.current?.remove) {
          responseListener.current.remove();
        }
      } catch (e) {
        console.warn("Erro ao limpar listeners:", e);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <StudentsProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {/* 🔐 Login e Registro */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Registrar Conta" }}
            />

            {/* 🧭 Administração */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Painel Administrativo" }}
            />
            <Stack.Screen
              name="AddStudent"
              component={AddStudentScreen}
              options={{ title: "Cadastrar Aluno" }}
            />
            <Stack.Screen
              name="EditStudent"
              component={EditStudentScreen}
              options={{ title: "Editar Aluno" }}
            />
            <Stack.Screen
              name="View"
              component={ViewScreen}
              options={{ title: "Informações do Aluno" }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ title: "Adicionar Pagamento" }}
            />
            <Stack.Screen
              name="ParcelScreen"
              component={ParcelScreen}
              options={{ title: "Enviar Parcela" }}
            />
            <Stack.Screen
              name="ParcelPayment"
              component={ParcelPaymentScreen}
              options={{ title: "Detalhes da Parcela" }}
            />

            {/* 👤 Usuário comum */}
            <Stack.Screen
              name="UserHome"
              component={UserHomeScreen}
              options={{ title: "Meus Alunos" }}
            />
            <Stack.Screen
              name="UserView"
              component={UserViewScreen}
              options={{ title: "Informações do Aluno" }}
            />
            <Stack.Screen
              name="UserPayments"
              component={UserPaymentsScreen}
              options={{ title: "Minhas Parcelas" }}
            />
            <Stack.Screen
              name="AllPayments"
              component={AllPaymentsScreen}
              options={{ title: "Todas as Parcelas" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StudentsProvider>
    </AuthProvider>
  );
}

/**
 * Configura canal de notificações e permissões
 */
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      Alert.alert("Aviso", "Notificações só funcionam em dispositivos físicos.");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permissão", "Permissão para notificações não concedida.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    const token = tokenData?.data ?? null;
    console.log("Push token:", token);
    return token;
  } catch (error) {
    console.warn("Erro ao registrar notificações:", error);
    return null;
  }
}

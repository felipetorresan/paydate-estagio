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
import ParcelScreen from "./src/screens/ParcelScreen";

// Usuário comum
import UserHomeScreen from "./src/screens/UserHomeScreen";
import UserViewScreen from "./src/screens/UserViewScreen";
import UserPaymentsScreen from "./src/screens/UserPaymentsScreen";
import ParcelPaymentScreen from "./src/screens/ParcelPaymentScreen";

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
    // registra permissões / canal
    registerForPushNotificationsAsync();

    // adiciona listeners e guarda as subscriptions retornadas
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📩 Notificação recebida:", notification);
      }
    );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Usuário clicou na notificação:", response);
      });

    // cleanup: remover listeners corretamente
    return () => {
      try {
        if (notificationListener.current && typeof notificationListener.current.remove === "function") {
          notificationListener.current.remove();
        } else if (notificationListener.current && typeof Notifications.removeNotificationSubscription === "function") {
          // compat fallback — mas geralmente não existe em versões mais novas
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
      } catch (e) {
        console.warn("Erro ao remover notificationListener:", e);
      }

      try {
        if (responseListener.current && typeof responseListener.current.remove === "function") {
          responseListener.current.remove();
        } else if (responseListener.current && typeof Notifications.removeNotificationSubscription === "function") {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      } catch (e) {
        console.warn("Erro ao remover responseListener:", e);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <StudentsProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {/* Login e Registro */}
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

            {/* Administração */}
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

            {/* Usuário */}
            <Stack.Screen
              name="UserHome"
              component={UserHomeScreen}
              options={{ title: "Meus Alunos" }}
            />
            <Stack.Screen
              name="UserPayments"
              component={UserPaymentsScreen}
              options={{ title: "Minhas Parcelas" }}
            />
            <Stack.Screen
              name="UserView"
              component={UserViewScreen}
              options={{ title: "Informações do Aluno" }}
            />
            <Stack.Screen
              name="ParcelScreen"
              component={ParcelScreen}
              options={{ title: "Enviar Parcela" }}
            />
            <Stack.Screen
              name="ParcelPayment"
              component={ParcelPaymentScreen}
              options={{ title: "Pagamento da Parcela" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StudentsProvider>
    </AuthProvider>
  );
}

/**
 * Pede permissão para notificações e configura canal Android.
 * Retorna token de dispositivo (string) quando disponível.
 */
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      Alert.alert("Aviso", "Notificações só funcionam em dispositivos físicos.");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permissão", "Permissão para notificações não concedida.");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
    }

    // opcional: token para push server (não usado agora)
    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    const token = tokenData?.data ?? null;
    console.log("Push token:", token);
    return token;
  } catch (error) {
    console.warn("Erro ao registrar notificações:", error);
    return null;
  }
}

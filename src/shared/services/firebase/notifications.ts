import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Permissão para notificações concedida.");
    return true;
  }
  return false;
}

export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token do usuário:", token);
    // Aqui, no futuro, você enviará esse token para o seu banco de dados
    // para saber para qual celular mandar a notificação.
    return token;
  } catch (error) {
    console.error("Erro ao pegar o FCM Token", error);
  }
}

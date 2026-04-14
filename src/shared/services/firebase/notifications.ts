import messaging from "@react-native-firebase/messaging";
import { Alert, Platform, PermissionsAndroid } from "react-native";
import * as Device from "expo-device";

export async function requestUserPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("✅ [Android] Permissão nativa concedida.");
      return true;
    } else {
      console.log("❌ [Android] Permissão negada pelo usuário.");
      return false;
    }
  }

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
    return token;
  } catch (error) {
    console.error("Erro ao pegar o FCM Token", error);
  }
}

export async function getDeviceInfoPayload() {
  try {
    const device_token = await getFCMToken();
    const os = Platform.OS;
    const model = Device.modelName || "Desconhecido";

    return {
      device_token,
      os,
      model,
    };
  } catch (error) {
    console.error("Erro ao ler dados do dispositivo:", error);
    return {};
  }
}

export async function deleteFCMToken() {
  try {
    await messaging().deleteToken();
    console.log("FCM Token deletado com sucesso do aparelho.");
  } catch (error) {
    console.error("Erro ao deletar FCM Token do Firebase", error);
  }
}

import "./src/styles/global.css";
import NavigationRoutes from "@/routes";
import { AuthContextProvider } from "@/context/auth.context";
import { SnackbarContextProvider } from "@/context/snackbar.context";
import { Snackbar } from "@/components/Snackbar";
import { BottomSheetProvider } from "@/context/bottomsheet.context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TransactionContextProvider } from "@/context/transaction.context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ActivityIndicator, Alert, View } from "react-native";
import { CategoryContextProvider } from "@/context/category.context";
import { DatabaseProvider } from "@nozbe/watermelondb/DatabaseProvider";
import { database } from "@/databases";
import { useEffect } from "react";
import {
  requestUserPermission,
  getFCMToken,
} from "@/shared/services/firebase/notifications";
import messaging from "@react-native-firebase/messaging";
import "@/shared/services/notifications/bank-listener.service";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. Cria os botões "Salvar" e "Descartar"
Notifications.setNotificationCategoryAsync("TRANSACAO_BANCARIA", [
  {
    identifier: "SALVAR_TRANSACAO",
    buttonTitle: "Salvar",
    options: { opensAppToForeground: true },
  },
  {
    identifier: "DESCARTAR",
    buttonTitle: "Ignorar",
    options: { isDestructive: true, opensAppToForeground: false },
  },
]);

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    async function setupNotifications() {
      await requestUserPermission();
    }

    setupNotifications();

    // Isso escuta as notificações quando o app está ABERTO (em primeiro plano)
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        "Nova notificação no app!",
        JSON.stringify(remoteMessage.notification),
      );
    });

    return unsubscribe;
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <DatabaseProvider database={database}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SnackbarContextProvider>
          <AuthContextProvider>
            <CategoryContextProvider>
              <TransactionContextProvider>
                <BottomSheetProvider>
                  <NavigationRoutes />
                  <Snackbar />
                </BottomSheetProvider>
              </TransactionContextProvider>
            </CategoryContextProvider>
          </AuthContextProvider>
        </SnackbarContextProvider>
      </GestureHandlerRootView>
    </DatabaseProvider>
  );
}

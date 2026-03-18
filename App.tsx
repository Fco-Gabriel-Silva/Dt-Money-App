import NavigationRoutes from "@/routes";
import "./src/styles/global.css";
import { AuthContextProvider } from "@/context/auth.context";
import { SnackbarContextProvider } from "@/context/snackbar.context";
import { Snackbar } from "@/components/Snackbar";
import { BottomSheetProvider } from "@/context/bottomsheet.context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TransactionContextProvider } from "@/context/transaction.context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { ActivityIndicator, View } from "react-native";
import { CategoryContextProvider } from "@/context/category.context";
import { DatabaseProvider } from "@nozbe/watermelondb/DatabaseProvider";
import { database } from "@/databases";
import { useWifiSync } from "@/shared/hooks/useWifiSync";

export default function App() {
  useWifiSync();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

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

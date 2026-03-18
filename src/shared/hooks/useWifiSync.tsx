import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncWithBackend } from "@/databases/sync";

export function useWifiSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.type === "wifi") {
        console.log(
          "🟢 Conectado ao Wi-Fi! Preparando para sincronizar o WatermelonDB...",
        );

        syncWithBackend();
      } else if (state.isConnected && state.type === "cellular") {
        console.log(
          "🟡 Conectado no 4G/5G. Sincronização em segundo plano pausada.",
        );
      } else {
        console.log("🔴 Modo totalmente Offline.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
}

import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./index";
import { dtMoneyApi } from "@/shared/api/dt-money";

let syncPromise: Promise<void> | null = null;

export async function syncWithBackend() {
  if (syncPromise) {
    console.log(
      "⏳ Sincronização já em andamento. Aguardando a atual terminar...",
    );
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
          const response = await dtMoneyApi.get("/sync", {
            params: { lastPulledAt },
          });
          return {
            changes: response.data.changes,
            timestamp: response.data.timestamp,
          };
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
          await dtMoneyApi.post("/sync", {
            changes,
            lastPulledAt,
          });
        },
      });

      console.log("✅ Sincronização concluída com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao sincronizar com o backend:", error);
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
}

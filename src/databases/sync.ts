import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./index";
import { dtMoneyApi } from "@/shared/api/dt-money";

let isSyncing = false;

export async function syncWithBackend() {
  if (isSyncing) {
    console.log("⏳ Sincronização já em andamento. Ignorando chamada extra.");
    return;
  }

  try {
    isSyncing = true;

    await synchronize({
      database,

      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        const response = await dtMoneyApi.get("/sync", {
          params: {
            lastPulledAt: lastPulledAt,
          },
        });

        const data = response.data;

        return {
          changes: data.changes,
          timestamp: data.timestamp,
        };
      },

      pushChanges: async ({ changes, lastPulledAt }) => {
        await dtMoneyApi.post("/sync", {
          changes: changes,
          lastPulledAt: lastPulledAt,
        });
      },

      // migrationsEnabledAtVersion: 1,
    });

    console.log("✅ Sincronização concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar com o backend:", error);
  } finally {
    isSyncing = false;
  }
}

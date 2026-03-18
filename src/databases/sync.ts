import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./index";
import { dtMoneyApi } from "@/shared/api/dt-money";

// 🚨 ATENÇÃO: Aqui entra o IP do seu computador na rede Wi-Fi!
// Não use 'localhost', senão o celular tenta achar a API dentro dele mesmo.

export async function syncWithBackend() {
  try {
    await synchronize({
      database,

      // =========================================================
      // 1. PULL: CELULAR PERGUNTANDO AO SERVIDOR SE HÁ NOVIDADES
      // =========================================================
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        // Se lastPulledAt tiver um número, mandamos na URL. Se for null (primeira vez), mandamos vazio.
        const urlParams = lastPulledAt ? `?lastPulledAt=${lastPulledAt}` : "";

        // Faz a requisição GET para o backend
        const response = await fetch(`${dtMoneyApi}${urlParams}`);

        if (!response.ok) {
          throw new Error("Falha ao buscar dados novos do servidor.");
        }

        // O backend devolve um JSON com as 'changes' (tabelas) e o 'timestamp' (hora do servidor)
        const data = await response.json();

        // Entregamos isso de volta para o WatermelonDB salvar no celular
        return {
          changes: data.changes,
          timestamp: data.timestamp,
        };
      },

      // =========================================================
      // 2. PUSH: CELULAR ENVIANDO O TRABALHO OFFLINE AO SERVIDOR
      // =========================================================
      pushChanges: async ({ changes, lastPulledAt }) => {
        // Fazemos uma requisição POST enviando o "pacotão" de dados criados offline
        const response = await fetch(dtMoneyApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Transformamos o objeto 'changes' em texto JSON para viajar pela rede
          body: JSON.stringify({ changes, lastPulledAt }),
        });

        if (!response.ok) {
          throw new Error("Falha ao enviar dados locais para o servidor.");
        }

        // No push não precisamos retornar nada. Se o fetch deu status 200 (ok),
        // o WatermelonDB entende que o envio foi um sucesso.
      },

      migrationsEnabledAtVersion: 1,
    });

    console.log("✅ Sincronização concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar com o backend:", error);
  }
}

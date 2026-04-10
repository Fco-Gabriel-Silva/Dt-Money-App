import { RNAndroidNotificationListenerHeadlessJsName } from "react-native-android-notification-listener";
import { AppRegistry } from "react-native";
import * as Notifications from "expo-notifications";

// Essa função roda em segundo plano, mesmo com o app fechado!
const headlessNotificationListener = async ({ notification }: any) => {
  if (!notification) return;

  try {
    const payload = JSON.parse(notification);
    const { app, title, text } = payload;

    // 1. Filtra apenas apps de banco (Ex: Nubank, Inter, PicPay)
    // Para pegar o ID exato do app do seu banco, você pode dar um console.log(app) temporário.
    const bankApps = [
      // --- Digitais e FinTechs ---
      "com.nu.production", // Nubank
      "br.com.intermedium", // Banco Inter
      "com.picpay", // PicPay
      "com.mercadopago.wallet", // Mercado Pago
      "com.c6bank.app", // C6 Bank
      "br.com.uol.ps.myaccount", // PagBank (PagSeguro)
      "br.com.xp.carteira", // XP Investimentos

      // --- Bancos Tradicionais ---
      "br.com.bb.android", // Banco do Brasil
      "com.itau", // Itaú
      "com.itau.personnalite", // Itaú Personnalité
      "br.com.bradesco.banco", // Bradesco
      "br.com.bradesco.next", // Bradesco Next
      "com.santander.app", // Santander
      "br.com.gabba.Caixa", // Caixa Econômica Federal
      "br.gov.caixa.tem", // Caixa Tem

      // --- Cooperativas ---
      "br.com.sicredi.mobilesicredi", // Sicredi
      "br.com.sicoobnet", // Sicoob
    ];
    if (!bankApps.includes(app)) return;

    // 2. Procura palavras-chave de ganho ou gasto
    const textLower = text.toLowerCase();
    const isRevenue =
      textLower.includes("recebeu") ||
      textLower.includes("transferência recebida");
    const isExpense =
      textLower.includes("pagamento") ||
      textLower.includes("transferência enviada") ||
      textLower.includes("compra aprovada");

    if (!isRevenue && !isExpense) return;

    // 3. Regex para encontrar o valor (Ex: R$ 150,00 -> 150.00)
    const valueMatch = text.match(/R\$\s?([\d.,]+)/);
    if (!valueMatch) return;

    // Converte a string "1.500,00" para número 1500.00
    const rawValue = valueMatch[1].replace(/\./g, "").replace(",", ".");
    const transactionValue = parseFloat(rawValue);

    // Em vez de salvar no banco, o Vigia cria uma notificação local!
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💰 Nova transação detectada!",
        body: `Encontramos um registro de R$ ${transactionValue} no ${app.includes("nu") ? "Nubank" : "banco"}.`,
        categoryIdentifier: "TRANSACAO_BANCARIA", // Chama os botões que criamos no Passo 2
        data: {
          value: transactionValue,
          bank: app,
          isRevenue: isRevenue,
        }, // Esconde os dados aqui para usarmos depois
      },
      trigger: null, // trigger null faz ela aparecer imediatamente
    });

    console.log(
      `✅ [BankListener] Notificação de confirmação enviada para o usuário.`,
    );
  } catch (err) {
    console.error(
      "❌ [BankListener] Erro ao processar notificação em background",
      err,
    );
  }
};

// Registra a tarefa nativa no Android
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

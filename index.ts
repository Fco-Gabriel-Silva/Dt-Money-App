import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";

import App from "./App";

// Isso registra o "Vigia de Segundo Plano" na raiz do sistema
// Ele vai rodar mesmo se o App.tsx estiver morto.
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Mensagem recebida em background!", remoteMessage);

  // Aqui no futuro, mesmo com o app fechado, você poderia fazer o
  // WatermelonDB sincronizar dados ou salvar a notificação no banco local!
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

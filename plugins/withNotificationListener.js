const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // ==========================================
    // MÁGICA NOVA: Resolve o conflito do allowBackup
    // Diz para o Android usar a regra do nosso App e ignorar a da biblioteca
    // ==========================================
    const currentReplace = mainApplication.$["tools:replace"] || "";
    if (!currentReplace.includes("android:allowBackup")) {
      mainApplication.$["tools:replace"] = currentReplace
        ? `${currentReplace},android:allowBackup`
        : "android:allowBackup";
    }

    // Adiciona o serviço de escuta nativo do Android
    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    // Evita duplicar o serviço se rodar o prebuild duas vezes
    const serviceExists = mainApplication.service.some(
      (s) =>
        s.$["android:name"] ===
        "com.reactnativenotificationlistener.RNNotificationListenerService",
    );

    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          "android:name":
            "com.reactnativenotificationlistener.RNNotificationListenerService",
          "android:label": "@string/app_name",
          "android:permission":
            "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name":
                    "android.service.notification.NotificationListenerService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};

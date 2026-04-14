const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // ==========================================
    // MANTEMOS APENAS A RESOLUÇÃO DO CONFLITO
    // Isso diz ao Android para usar o seu allowBackup e ignorar o da lib
    // ==========================================
    const currentReplace = mainApplication.$["tools:replace"] || "";
    if (!currentReplace.includes("android:allowBackup")) {
      mainApplication.$["tools:replace"] = currentReplace
        ? `${currentReplace},android:allowBackup`
        : "android:allowBackup";
    }

    // REMOVEMOS a parte do mainApplication.service.push(...)
    // porque a biblioteca já faz isso sozinha internamente.

    return config;
  });
};

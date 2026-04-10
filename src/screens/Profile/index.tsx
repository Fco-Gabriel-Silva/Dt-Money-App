import { Text } from "@/components/Text";
import { ScrollView, View } from "react-native";
import { HeaderProfile } from "./HeaderProfile";
import { useAuthContext } from "@/context/auth.context";
import clsx from "clsx";
import { AppButton } from "@/components/AppButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PrivateStackParamsList } from "@/routes/PrivateRoutes";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import RNAndroidNotificationListener from "react-native-android-notification-listener";
import { Alert } from "react-native";

export const Profile = () => {
  const { user } = useAuthContext();
  const navigation = useNavigation<NavigationProp<PrivateStackParamsList>>();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderProfile avatarUrl={user?.avatarUrl} />

        <View className="flex-1 px-10 pt-20 gap-8">
          <View>
            <Text className="text-gray-500 text-lg font-sans">Nome</Text>
            <View className="border border-gray-700 rounded-xl px-4 py-2">
              <Input
                className="text-white text-base font-sans py-2 p-0"
                readOnly={true}
              >
                {user?.name}
              </Input>
            </View>
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Email</Text>
            <View className="border border-gray-700 rounded-xl px-4 py-2">
              <Input
                className="text-white text-base font-sans py-2 p-0"
                readOnly={true}
              >
                {user?.email}
              </Input>
            </View>
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Senha</Text>
            <View className="border border-gray-700 rounded-xl px-4 py-2">
              <Input
                className="text-white text-base font-sans py-2 p-0"
                readOnly={true}
                placeholder="********"
                placeholderTextColor={colors.gray[700]}
              >
                {user?.password}
              </Input>
            </View>
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Telefone</Text>
            <View className="border border-gray-700  rounded-xl px-4 py-2">
              <Input
                className="text-white text-base font-sans py-2 p-0"
                readOnly={true}
                placeholder="-"
                placeholderTextColor={colors.gray[700]}
              >
                {user?.phone}
              </Input>
            </View>
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans mb-2">
              Automação Bancária
            </Text>
            <AppButton
              mode="outline"
              iconName="sync"
              onPress={async () => {
                const status =
                  await RNAndroidNotificationListener.getPermissionStatus();
                if (status !== "authorized") {
                  Alert.alert(
                    "Atenção",
                    "Para o Zap Money ler seus Pix e pagamentos, precisamos que você autorize a leitura de notificações na próxima tela.",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Autorizar",
                        onPress: () =>
                          RNAndroidNotificationListener.requestPermission(),
                      },
                    ],
                  );
                } else {
                  Alert.alert(
                    "Sucesso",
                    "A automação já está ativada e escutando os bancos!",
                  );
                }
              }}
            >
              Ativar Leitor de Notificações
            </AppButton>
          </View>

          <AppButton
            onPress={() => navigation.navigate("ProfileEdit")}
            className="mt-4"
          >
            Editar
          </AppButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

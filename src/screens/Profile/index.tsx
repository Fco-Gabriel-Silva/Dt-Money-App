import { Text } from "@/components/Text";
import { View } from "react-native";
import { HeaderProfile } from "./HeaderProfile";
import { useAuthContext } from "@/context/auth.context";
import clsx from "clsx";
import { AppButton } from "@/components/AppButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PrivateStackParamsList } from "@/routes/PrivateRoutes";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";

export const Profile = () => {
  const { user } = useAuthContext();
  const navigation = useNavigation<NavigationProp<PrivateStackParamsList>>();

  return (
    <View className="flex-1 bg-background-primary">
      <HeaderProfile />

      <View className="flex-1 px-10 pt-20 gap-8">
        <View>
          <Text className="text-gray-500 text-lg font-sans">Nome</Text>
          <View className="border border-gray-700 rounded-xl px-4 py-2">
            <Input
              className="text-white text-base font-sans mt-2 p-0"
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
              className="text-white text-base font-sans mt-2 p-0"
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
              className="text-white text-base font-sans mt-2 p-0"
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
              className="text-white text-base font-sans mt-2 p-0"
              readOnly={true}
              placeholder="-"
              placeholderTextColor={colors.gray[700]}
            >
              {user?.phone}
            </Input>
          </View>
        </View>
        <AppButton
          onPress={() => navigation.navigate("ProfileEdit")}
          className="mt-4"
        >
          Editar
        </AppButton>
      </View>
    </View>
  );
};

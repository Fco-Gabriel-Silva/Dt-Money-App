import { Text } from "@/components/Text";
import { PrivateDrawerParamsList } from "@/routes/PrivateRoutes/DrawerNavigator";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export const HeaderProfile = () => {
  const navigation = useNavigation<NavigationProp<PrivateDrawerParamsList>>();

  return (
    <View className="relative z-50">
      <View className="bg-accent-brand h-[150]">
        <View className="flex-row items-center justify-center relative w-full h-16">
          <TouchableOpacity
            onPress={() => navigation.navigate("Início")}
            activeOpacity={0.7}
            className="absolute left-0 z-10"
          >
            <MaterialIcons name="chevron-left" size={50} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-sans">Meu Perfil</Text>
        </View>
      </View>

      <View className="absolute w-full items-center top-[75px] z-50">
        <View className="bg-background-primary rounded-full">
          <FontAwesome5 name="user-circle" size={120} color="white" />
        </View>
      </View>
    </View>
  );
};

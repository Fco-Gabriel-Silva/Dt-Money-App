import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/auth.context";
import { Text } from "@/components/Text";
import { colors } from "@/styles/colors";

export const ProfileSidebar = (props: DrawerContentComponentProps) => {
  const { user } = useAuthContext();
  const { handleLogout } = useAuthContext();

  return (
    <DrawerContentScrollView {...props}>
      <View className="gap-3 mb-6">
        <View className="mt-4 ml-2 flex-row items-center gap-2">
          <FontAwesome5
            name="user-circle"
            size={35}
            color={colors["accent-brand"]}
          />
          <Text className="text-lg text-accent-brand">{user?.name}</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center gap-2 ml-3"
        >
          <MaterialIcons name="logout" color={colors.gray[700]} size={20} />
          <Text className="text-gray-700 text-sm">Sair da conta</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

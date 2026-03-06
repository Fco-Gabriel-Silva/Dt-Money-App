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
    <View className="flex-1" style={{ marginInline: 20 }}>
      <DrawerContentScrollView {...props}>
        <View className="mb-6 border-solid border-b border-gray-800">
          <View className="mt-4 mb-6 mx-5 flex-row items-center gap-3">
            <FontAwesome5
              name="user-circle"
              size={60}
              color={colors["accent-brand"]}
            />

            <View>
              <Text className="text-lg text-accent-brand">{user?.name}</Text>
              <Text className="text-sm text-gray-700">{user?.email}</Text>
            </View>
          </View>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View className="p-4 mb-4 border-t border-gray-800 border-solid">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center gap-2"
        >
          <MaterialIcons name="logout" color={colors.gray[700]} size={30} />
          <Text className="text-gray-700 text-base">Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

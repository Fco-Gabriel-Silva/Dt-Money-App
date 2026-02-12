import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuthContext } from "@/context/auth.context";
import { Text } from "@/components/Text";

export const ProfileSidebar = (props: DrawerContentComponentProps) => {
  const { user } = useAuthContext();

  return (
    <DrawerContentScrollView {...props}>
      <View className="my-4 ml-2 flex-row items-center gap-4">
        <FontAwesome5 name="user-circle" size={30} color="black" />
        <Text className="text-base text-black">{user?.name}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

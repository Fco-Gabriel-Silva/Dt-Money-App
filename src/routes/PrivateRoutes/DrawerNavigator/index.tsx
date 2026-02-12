import { createDrawerNavigator } from "@react-navigation/drawer";
import { StackNavigator } from "./StackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSidebar } from "./ProfileSidebar";
import { fontFamily } from "@/styles/fontFamily";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleStyle: { fontFamily: fontFamily.sans },
          drawerLabelStyle: { fontFamily: fontFamily.sans },
        }}
        drawerContent={ProfileSidebar}
      >
        <Drawer.Screen name="StackNavigator" component={StackNavigator} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

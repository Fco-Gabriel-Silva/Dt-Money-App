import { createDrawerNavigator } from "@react-navigation/drawer";
import { StackNavigator } from "./StackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSidebar } from "./ProfileSidebar";
import { fontFamily } from "@/styles/fontFamily";
import { colors } from "@/styles/colors";
import { useState } from "react";
import { ListCategories } from "@/components/ListCategories";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <Drawer.Navigator
        drawerContent={ProfileSidebar}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors["background-primary"],
          },
          headerTitleStyle: {
            fontFamily: fontFamily.sans,
          },
          headerTintColor: colors.white,
          drawerLabelStyle: { fontFamily: fontFamily.sans },
          drawerStyle: {
            backgroundColor: colors["background-primary"],
          },
          drawerActiveBackgroundColor: `${colors["accent-brand"]}4D`,
          drawerActiveTintColor: colors.white,
          drawerInactiveTintColor: colors.white,
          drawerItemStyle: {
            marginVertical: 5,
          },
        }}
      >
        <Drawer.Screen name="Início" component={StackNavigator} />
        <Drawer.Screen name="Categorias" component={ListCategories} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

import { createDrawerNavigator } from "@react-navigation/drawer";
import { StackNavigator } from "./StackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "@/styles/fontFamily";
import { colors } from "@/styles/colors";
import { useState } from "react";
import { ListCategories } from "@/screens/ListCategories";
import { Profile } from "@/screens/Profile";
import { Sidebar } from "./Sidebar";

const Drawer = createDrawerNavigator();

export type PrivateDrawerParamsList = {
  Início: undefined;
  "Meu Perfil": undefined;
  Categorias: undefined;
};

export const DrawerNavigator = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <Drawer.Navigator
        drawerContent={Sidebar}
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
        <Drawer.Screen
          name="Meu Perfil"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="Categorias" component={ListCategories} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

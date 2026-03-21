import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "@/styles/fontFamily";
import { colors } from "@/styles/colors";
import { Home } from "@/screens/Home";
import { ListCategories } from "@/screens/ListCategories";
import { Profile } from "@/screens/Profile";
import { Sidebar } from "./Sidebar";
import { useWifiSync } from "@/shared/hooks/useWifiSync";

const Drawer = createDrawerNavigator();

export type PrivateDrawerParamsList = {
  Início: undefined;
  "Meu Perfil": undefined;
  Categorias: undefined;
};

export const DrawerNavigator = () => {
  useWifiSync();

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
        {/* Agora o Início chama o componente Home diretamente! */}
        <Drawer.Screen name="Início" component={Home} />
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

import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigator } from "./DrawerNavigator";
import { EditUserForm } from "@/components/EditUserForm";

export type PrivateStackParamsList = {
  RootDrawer: undefined;
  ProfileEdit: undefined;
};

const PrivateStack = createStackNavigator<PrivateStackParamsList>();

export const PrivateRoutes = () => {
  return (
    <PrivateStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PrivateStack.Screen name="RootDrawer" component={DrawerNavigator} />
      <PrivateStack.Screen name="ProfileEdit" component={EditUserForm} />
    </PrivateStack.Navigator>
  );
};

import { EditUserForm } from "@/components/EditUserForm";
import { Home } from "@/screens/Home";
import { createStackNavigator } from "@react-navigation/stack";

export type PrivateStackParamsList = {
  Home: undefined;
  ProfileEdit: undefined;
};

export const StackNavigator = () => {
  const PrivateStack = createStackNavigator<PrivateStackParamsList>();

  return (
    <PrivateStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PrivateStack.Screen name="Home" component={Home} />
      <PrivateStack.Screen name="ProfileEdit" component={EditUserForm} />
    </PrivateStack.Navigator>
  );
};

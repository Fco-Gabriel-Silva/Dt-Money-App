import { Home } from "@/screens/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

export type PrivateStackParamsList = {
  Home: undefined;
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
    </PrivateStack.Navigator>
  );
};

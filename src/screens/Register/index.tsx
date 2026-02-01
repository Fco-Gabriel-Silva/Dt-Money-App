import { DismissKeyboardView } from "@/components/DismissKeyboardView";
import { View } from "react-native";
import { RegisterForm } from "./RegisterForm";
import { AuthHeader } from "@/components/AuthHeader";

export const Register = () => {
  return (
    <DismissKeyboardView>
      <View className="flex-1 w-[82%] self-center">
        <AuthHeader />
        <RegisterForm />
      </View>
    </DismissKeyboardView>
  );
};

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { PublicStackParamsList } from "@/routes/PublicRoutes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { useAuthContext } from "@/context/auth.context";
import { AxiosError } from "axios";

export interface FormRegisterParams {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormRegisterParams>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { handleRegister } = useAuthContext();

  const navigation = useNavigation<NavigationProp<PublicStackParamsList>>();

  const onSubmit = async (userData: FormRegisterParams) => {
    try {
      await handleRegister(userData);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <>
      <AppInput
        control={control}
        name="name"
        leftIconName="person"
        label="NOME"
        placeholder="Seu nome"
      />

      <AppInput
        control={control}
        name="email"
        leftIconName="mail-outline"
        label="EMAIL"
        placeholder="mail@example.br"
      />

      <AppInput
        control={control}
        name="password"
        leftIconName="lock-outline"
        label="SENHA"
        placeholder="Sua senha"
        secureTextEntry
      />

      <AppInput
        control={control}
        name="confirmPassword"
        leftIconName="lock-outline"
        label="SENHA"
        placeholder="Confirme sua senha"
        secureTextEntry
      />

      <View className="flex-1 justify-between mt-8 mb-6 min-h-[250px]">
        <AppButton onPress={handleSubmit(onSubmit)} iconName="arrow-forward">
          Cadastrar
        </AppButton>

        <View>
          <Text className="mb-6 text-gray-300 text-base">
            Já possui uma conta?
          </Text>
          <AppButton
            onPress={() => navigation.navigate("Login")}
            iconName="arrow-forward"
            mode="outline"
          >
            Acessar
          </AppButton>
        </View>
      </View>
    </>
  );
};

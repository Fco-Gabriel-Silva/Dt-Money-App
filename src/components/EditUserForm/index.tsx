import { ActivityIndicator, View } from "react-native";
import { HeaderProfile } from "@/screens/Profile/HeaderProfile";
import { Input } from "../Input";
import { Text } from "../Text";
import { AppButton } from "../AppButton";
import { useAuthContext } from "@/context/auth.context";
import { colors } from "@/styles/colors";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useNavigation } from "@react-navigation/native";
import { DismissKeyboardView } from "../DismissKeyboardView";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { userSchema } from "./schema";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";
import { ErrorMessage } from "../ErrorMessage";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "@/shared/services/dt-money/user.service";
import { useState } from "react";
import { dtMoneyApi } from "@/shared/api/dt-money";

export interface FormEditParams {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const EditUserForm = () => {
  const { user, updateUser, restoreUserSession } = useAuthContext();
  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();
  const navigation = useNavigation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormEditParams>({
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    },
  });

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      notify({
        message: "Precisamos de permissão para acessar a galeria",
        messageType: "ERROR",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: FormEditParams) => {
    try {
      if (!user) return;

      let finalAvatarUrl = user.avatarUrl || "";

      if (selectedImage) {
        const response = await uploadAvatar(selectedImage);

        finalAvatarUrl = `${dtMoneyApi.defaults.baseURL}/uploads/${response.fileName}`;
        console.log("URL FINAL GERADA:", finalAvatarUrl);
      }

      const payload: UpdateUserRequest = {
        id: user.id,
        name: data.name || user.name,
        email: data.email || user.email,
        password: data.password || user.password,
        phone: data.phone || "",
        avatarUrl: finalAvatarUrl,
      };

      await updateUser(payload);
      await restoreUserSession();

      notify({
        message: "Perfil atualizado com sucesso!",
        messageType: "SUCCESS",
      });
      navigation.goBack();
    } catch (error) {
      handleError(error, "Falha ao atualizar o perfil");
    }
  };

  return (
    <DismissKeyboardView>
      <View className="flex-1 bg-background-primary">
        <HeaderProfile
          title="Editar Perfil"
          isEdit
          avatarUrl={selectedImage || user?.avatarUrl}
          onEditAvatarPress={handlePickImage}
        />

        <View className="flex-1 px-10 pt-20 gap-8">
          <View>
            <Text className="text-gray-500 text-lg font-sans">Nome</Text>
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="border border-gray-700 rounded-xl px-4 py-2">
                    <Input
                      className="text-white text-base font-sans py-2 p-0"
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                </>
              )}
            />
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="border border-gray-700 rounded-xl px-4 py-2">
                    <Input
                      className="text-white text-base font-sans py-2 p-0"
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                </>
              )}
            />
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="border border-gray-700 rounded-xl px-4 py-2">
                    <Input
                      className="text-white text-base font-sans py-2 p-0"
                      onChangeText={onChange}
                      value={value}
                      placeholder="********"
                      placeholderTextColor={colors.gray[700]}
                      secureTextEntry
                    />
                  </View>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                </>
              )}
            />
          </View>

          <View>
            <Text className="text-gray-500 text-lg font-sans">Telefone</Text>
            <Controller
              control={control}
              name="phone"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="border border-gray-700 rounded-xl px-4 py-2">
                    <Input
                      className="text-white text-base font-sans py-2 p-0"
                      onChangeText={onChange}
                      value={value}
                      placeholder="-"
                      placeholderTextColor={colors.gray[700]}
                      keyboardType="numeric"
                    />
                  </View>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                </>
              )}
            />
          </View>

          <AppButton
            onPress={handleSubmit(onSubmit)}
            className="mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              "Atualizar Perfil"
            )}
          </AppButton>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

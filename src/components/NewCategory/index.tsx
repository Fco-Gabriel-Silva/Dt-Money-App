import { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MaterialIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import clsx from "clsx";

import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/context/snackbar.context"; // Para avisar sucesso
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";

import { Text } from "../Text";
import { Input } from "../Input";
import { AppButton } from "../AppButton";
import { ErrorMessage } from "../ErrorMessage";
import { categorySchema } from "./schema";
import { CreateCategoryRequest } from "@/shared/interfaces/https/create-category-request";
import { useCategoryContext } from "@/context/category.context";
import { useAuthContext } from "@/context/auth.context";
import { AVAILABLE_COLORS } from "@/styles/available-colors";

export const NewCategory = () => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { createCategory } = useCategoryContext();
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const {
    control, // Se for usar Controller no Input, mas seu Input atual é direto
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    resolver: yupResolver(categorySchema),
    defaultValues: { name: "", color: "", userId: user?.id },
  });

  const selectedColor = watch("color");
  const name = watch("name"); // Monitorando o valor para passar pro Input customizado

  const handleCreate = async (data: CreateCategoryRequest) => {
    try {
      setLoading(true);
      await createCategory(data);
      notify({
        message: "Categoria criada com sucesso!",
        messageType: "SUCCESS",
      });
      closeBottomSheet();
    } catch (error) {
      handleError(error, "Falha ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-8 py-5">
      <TouchableOpacity
        onPress={closeBottomSheet}
        className="w-full flex-row items-center justify-between"
      >
        <Text className="text-white text-xl font-heading">Nova Categoria</Text>
        <MaterialIcons name="close" color={colors.gray[700]} size={20} />
      </TouchableOpacity>

      <View className="mt-4 mb-8">
        <Input
          onChangeText={(text) => setValue("name", text)}
          placeholder="Nome da categoria"
          placeholderTextColor={colors.gray[700]}
          value={name}
          className="text-white text-lg bg-background-primary my-2 rounded-[6] pl-4"
          style={{ fontFamily: fontFamily.sans }}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Text className="text-gray-300 mt-4 mb-2">Cor de identificação</Text>
        <View className="flex-row gap-4 flex-wrap">
          {AVAILABLE_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setValue("color", color)}
              className={clsx(
                "w-10 h-10 rounded-full items-center justify-center border-2",
                selectedColor === color ? "border-white" : "border-transparent",
              )}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <MaterialIcons name="check" size={20} color={colors.white} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        {errors.color && <ErrorMessage>{errors.color.message}</ErrorMessage>}

        <View className="mt-8">
          <AppButton onPress={handleSubmit(handleCreate)}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              "Criar Categoria"
            )}
          </AppButton>
        </View>
      </View>
    </View>
  );
};

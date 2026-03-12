import { FC, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";

import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/context/snackbar.context"; // Para avisar sucesso
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";

import { categorySchema } from "./schema";
import { useCategoryContext } from "@/context/category.context";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AppButton } from "@/components/AppButton";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { UpdateCategoryRequest } from "@/shared/interfaces/https/update-category-request";
import { useAuthContext } from "@/context/auth.context";
import { AVAILABLE_COLORS } from "@/styles/available-colors";

interface Params {
  category: TransactionCategory;
}

export const EditCategoryForm: FC<Params> = ({
  category: categoryToUpdate,
}) => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const { updateCategory } = useCategoryContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const {
    control, // Se for usar Controller no Input, mas seu Input atual é direto
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryRequest>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      id: categoryToUpdate.id,
      name: categoryToUpdate.name,
      color: categoryToUpdate.color,
      userId: user?.id,
    },
  });

  const selectedColor = watch("color");
  const name = watch("name"); // Monitorando o valor para passar pro Input customizado

  const handleUpdate = async (data: UpdateCategoryRequest) => {
    try {
      setLoading(true);
      await updateCategory(data);
      notify({
        message: "Categoria atualizada com sucesso!",
        messageType: "SUCCESS",
      });
      closeBottomSheet();
    } catch (error) {
      handleError(error, "Falha ao atualizar categoria");
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
        <Text className="text-white text-xl font-heading">
          Editar Categoria
        </Text>
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
          <AppButton
            onPress={handleSubmit(handleUpdate, (errosDeValidacao) => {
              console.log("O Yup barrou! Motivo:", errosDeValidacao);
            })}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              "Editar Categoria"
            )}
          </AppButton>
        </View>
      </View>
    </View>
  );
};

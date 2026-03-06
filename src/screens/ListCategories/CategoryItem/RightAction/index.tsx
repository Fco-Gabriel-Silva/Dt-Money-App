import { useCategoryContext } from "@/context/category.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as categoryService from "@/shared/services/dt-money/category.service";
import { DeleteModal } from "./DeleteModal";

interface Params {
  category: TransactionCategory;
}

export const RightAction: FC<Params> = ({ category }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const { refreshCategories } = useCategoryContext();

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const { handleError } = useErrorHandler();

  const handleDeleteTransaction = async () => {
    try {
      setLoading(true);
      await categoryService.deleteCategory(category.id);
      notify({
        message: "Categoria deletada com sucesso",
        messageType: "SUCCESS",
      });
      hideModal();
      await refreshCategories();
    } catch (error) {
      handleError(error, "Falha ao deletar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View className="w-[70px] justify-center items-center">
        <View
          className="absolute top-0 bottom-0 bg-accent-red-background-primary rounded-r-[6]"
          style={{
            width: 100,
            right: 0,
          }}
        />
        <TouchableOpacity
          className="h-full w-full items-center justify-center z-10"
          onPress={showModal}
          activeOpacity={0.8}
        >
          <MaterialIcons name="delete-outline" color={colors.white} size={30} />
        </TouchableOpacity>
      </View>
      <DeleteModal
        visible={modalVisible}
        hideModal={hideModal}
        handleDeleteTransaction={handleDeleteTransaction}
        loading={loading}
      />
    </>
  );
};

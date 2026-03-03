import { useCategoryContext } from "@/context/category.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as categoryService from "@/shared/services/dt-money/category.service";
import { DeleteModal } from "./DeleteModal";

export const RightAction = ({
  category,
}: {
  category: TransactionCategory;
}) => {
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
        message: "Transação deletada com sucesso",
        messageType: "SUCCESS",
      });
      hideModal();
      await refreshCategories();
    } catch (error) {
      handleError(error, "Falha ao deletar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        className="h-[140] bg-accent-red-background-primary w-[80] rounded-r-[6] items-center justify-center"
        onPress={showModal}
        activeOpacity={0.8}
      >
        <MaterialIcons name="delete-outline" color={colors.white} size={30} />
      </TouchableOpacity>
      <DeleteModal
        visible={modalVisible}
        hideModal={hideModal}
        handleDeleteTransaction={handleDeleteTransaction}
        loading={loading}
      />
    </>
  );
};

import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useState } from "react";
import { DeleteModal } from "../DeleteModal";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { colors } from "@/shared/colors";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { Transaction } from "@/shared/interfaces/transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Params {
  transaction: Transaction;
}

export const RightAction: FC<Params> = ({ transaction }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const { refreshTransactions, getLocalTransactions } = useTransactionContext();

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
      if (transaction.isLocal) {
        const localTransactions = await getLocalTransactions();

        const filterTransactionsLocal = localTransactions.filter(
          (t: Transaction) => t.id !== transaction.id,
        );

        await AsyncStorage.setItem(
          "dt-money-transaction-local",
          JSON.stringify(filterTransactionsLocal),
        );
      } else {
        await transactionService.deleteTransaction(transaction.id);
      }
      notify({
        message: "Transação deletada com sucesso",
        messageType: "SUCCESS",
      });
      hideModal();
      await refreshTransactions();
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

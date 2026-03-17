import { useState, useMemo, FC } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useTransactionContext } from "@/context/transaction.context";
import clsx from "clsx";
import { colors } from "@/styles/colors";
import { Text } from "../Text";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { NewCategory } from "../NewCategory";
import { AppButton } from "../AppButton";
import { useCategoryContext } from "@/context/category.context";

interface Props {
  selectedCategory?: number | string;
  onSelect: (categoryId: number | string) => void;
}

export const SelectCategoryModal: FC<Props> = ({
  selectedCategory,
  onSelect,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { categories } = useCategoryContext();
  const { openBottomSheet } = useBottomSheetContext();
  const handleModal = () => setShowModal((prevState) => !prevState);

  const handleSelect = (categoryId: number | string) => {
    onSelect(categoryId);
    setShowModal(false);
  };

  const handleOpenNewCategory = () => {
    setShowModal(false); // Fecha o modal atual
    // Um pequeno timeout para a animação do modal não conflitar com o bottomsheet
    setTimeout(() => {
      openBottomSheet(<NewCategory />, 0);
    }, 300);
  };

  const selected = useMemo(
    () => categories?.find(({ id }) => id === selectedCategory),
    [selectedCategory, categories],
  );

  return (
    <>
      <TouchableOpacity
        onPress={handleModal}
        className="text-white text-lg h-[50] bg-background-primary my-2 rounded-[6] pl-4 justify-center"
      >
        <Text
          className={
            (clsx("text-lg"), selected ? "text-white" : "text-gray-700")
          }
        >
          {selected?.name ?? "Categoria"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleModal}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-background-secondary p-4 rounded-xl w-[90%] max-h-[80%]">
              <Text className="text-white text-lg mb-4 font-heading">
                Selecione uma categoria
              </Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => `category-${item.id}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.id)}
                    className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-2"
                  >
                    {item.color && (
                      <View
                        style={{ backgroundColor: item.color }}
                        className="w-3 h-3 rounded-full mr-2"
                      />
                    )}
                    <Checkbox
                      value={selected?.id === item.id}
                      onValueChange={() => handleSelect(item.id)}
                      color={
                        selected?.id === item.id
                          ? colors["accent-brand-light"]
                          : undefined
                      }
                      className="mr-2"
                    />
                    <Text className="text-white text-center text-lg font-normal">
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListHeaderComponent={() => (
                  <View className="bg-background-secondary shadow-lg shadow-black w-full">
                    <View className="mb-4 pb-4 border-b border-gray-700 bg-background-secondary">
                      <AppButton
                        mode="outline"
                        onPress={handleOpenNewCategory}
                        iconName="add"
                      >
                        Nova Categoria
                      </AppButton>
                    </View>
                  </View>
                )}
                stickyHeaderIndices={[0]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

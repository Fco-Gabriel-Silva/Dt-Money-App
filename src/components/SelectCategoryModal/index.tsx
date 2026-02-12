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

interface Props {
  selectedCategory?: number;
  onSelect: (categoryId: number) => void;
}

export const SelectCategoryModal: FC<Props> = ({
  selectedCategory,
  onSelect,
}) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal((prevState) => !prevState);

  const handleSelect = (categoryId: number) => {
    onSelect(categoryId);
    setShowModal(false);
  };

  const { categories } = useTransactionContext();

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
            <View className="bg-background-secondary p-4 rounded-xl w-[90%]">
              <Text className="text-white text-lg mb-4">
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
                    <Text className="text-white text-center text-lg">
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

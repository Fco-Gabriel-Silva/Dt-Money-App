import { colors } from "@/shared/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Params {
  visible: boolean;
  hideModal: () => void;
}

export const DeleteModal: FC<Params> = ({ visible, hideModal }) => {
  return (
    <View className="flex-1 absolute">
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={hideModal}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="m-5 bg-background-secondary rounded-[16] p-8 items-center shadow-lg w-[90%] h-[322] z-2">
                <View className="w-full content-between flex-row justify-between items-center border-b border-gray-300 pb-6">
                  <View className="flex-row gap-6 items-center">
                    <MaterialIcons
                      size={25}
                      name="error-outline"
                      className="mr-4"
                      color={colors.gray["400"]}
                    />
                    <Text className="text-white text-xl">
                      Apagar transação?
                    </Text>
                  </View>
                  <TouchableOpacity onPress={hideModal}>
                    <MaterialIcons
                      name="close"
                      color={colors.gray["800"]}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

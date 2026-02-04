import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { format } from "date-fns";

export const DateFilter = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartCancel = () => {
    setShowStartDatePicker(false);
  };

  const onStartConfirm = (selectedDate?: Date) => {
    setShowStartDatePicker(false);
  };

  const onEndCancel = () => {
    setShowStartDatePicker(false);
  };

  const onEndConfirm = (selectedDate?: Date) => {
    setShowStartDatePicker(false);
  };
  return (
    <>
      <Text className="text-gray-700 text-lg">Data</Text>

      <View className="flex-row justify-between mb-6">
        <View className="w-[48%]">
          <TouchableOpacity
            className="rounded-md p-2 border-b border-gray-800"
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text className="text-white text-lg">
              {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-[48%]">
          <TouchableOpacity
            className="rounded-md p-2 border-b border-gray-800"
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text className="text-white text-lg">
              {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={showStartDatePicker}
            date={new Date()}
            onCancel={onStartCancel}
            onConfirm={onStartConfirm}
            mode="date"
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
            locale="pt_BR"
          />
          <DateTimePicker
            isVisible={showEndDatePicker}
            date={new Date()}
            onCancel={onEndCancel}
            onConfirm={onEndConfirm}
            mode="date"
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
            locale="pt_BR"
          />
        </View>
      </View>
    </>
  );
};

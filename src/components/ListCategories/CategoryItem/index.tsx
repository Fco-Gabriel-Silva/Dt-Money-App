import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RightAction } from "./RightAction";
import { LeftAction } from "./LeftAction";

export const CategoryItem = ({
  category,
}: {
  category: TransactionCategory;
}) => {
  return (
    <Swipeable
      containerStyle={{
        alignItems: "center",
        alignSelf: "center",
        overflow: "visible",
        width: "90%",
        marginBottom: 16,
      }}
      overshootRight={false}
      overshootLeft={false}
      renderRightActions={() => <RightAction category={category} />}
      renderLeftActions={() => <LeftAction category={category} />}
    >
      <TouchableOpacity className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-2">
        {category.color && (
          <View
            style={{ backgroundColor: category.color }}
            className="w-3 h-3 rounded-full mr-2"
          />
        )}
        <Text className="text-white text-center text-lg font-normal">
          {category.name}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

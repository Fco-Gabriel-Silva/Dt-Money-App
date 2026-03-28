import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/styles/colors";

export const TransactionCardSkeleton = () => {
  return (
    <View className="w-[90%] self-center mb-4">
      <View className="h-[140px] rounded-[6px] bg-background-tertiary p-6 justify-between overflow-hidden">
        <View className="flex-row justify-between mt-1">
          <Skeleton
            colorMode="dark"
            width={150}
            height={20}
            colors={[colors.gray[800], colors.gray[700]]}
          />
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Skeleton
            colorMode="dark"
            width={140}
            height={28}
            colors={[colors.gray[800], colors.gray[700]]}
          />
        </View>

        <View className="flex-row w-full justify-between items-center mt-3">
          <View className="flex-row items-center gap-2">
            <Skeleton
              colorMode="dark"
              width={24}
              height={24}
              radius="round"
              colors={[colors.gray[800], colors.gray[700]]}
            />
            <Skeleton
              colorMode="dark"
              width={90}
              height={16}
              colors={[colors.gray[800], colors.gray[700]]}
            />
          </View>

          <View className="flex-row items-center gap-2">
            <Skeleton
              colorMode="dark"
              width={20}
              height={20}
              radius="round"
              colors={[colors.gray[800], colors.gray[700]]}
            />
            <Skeleton
              colorMode="dark"
              width={80}
              height={16}
              colors={[colors.gray[800], colors.gray[700]]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

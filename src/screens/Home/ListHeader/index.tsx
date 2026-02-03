import { AppHeader } from "@/components/AppHeader";
import { ScrollView, View } from "react-native";

export const ListHeader = () => {
  return (
    <>
      <AppHeader />
      <View className="h-[150] w-full">
        <View className="bg-background-primary h-[50]" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          className="absolute pl-6 h-[141]"
        ></ScrollView>
      </View>
    </>
  );
};

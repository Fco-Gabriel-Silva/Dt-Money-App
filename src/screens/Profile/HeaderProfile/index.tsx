import { Text } from "@/components/Text";
import { colors } from "@/styles/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface HeaderProfileProps {
  isEdit?: boolean;
  title?: string;
  onBackPress?: () => void;
  avatarUrl?: string | null;
  onEditAvatarPress?: () => void;
}

export const HeaderProfile = ({
  isEdit = false,
  title = "Meu Perfil",
  onBackPress,
  avatarUrl,
  onEditAvatarPress,
}: HeaderProfileProps) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="relative z-50">
      <View className="bg-accent-brand h-[150]">
        <View className="flex-row items-center justify-center relative w-full h-16">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            className="absolute left-0 z-10"
          >
            <MaterialIcons name="chevron-left" size={50} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-sans">{title}</Text>
        </View>
      </View>

      <View className="absolute w-full items-center top-[75px] z-50">
        <View className="relative w-[120px] h-[120px]">
          <View className="w-full h-full bg-background-primary rounded-full items-center justify-center overflow-hidden border-4 border-background-primary">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="w-full h-full" />
            ) : (
              <Image
                source={require("@/assets/profile.png")}
                className="w-full h-full"
              />
            )}
          </View>

          {isEdit && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onEditAvatarPress}
              className="absolute bg-accent-brand-background-primary items-center justify-center w-[44px] h-[44px] rounded-full right-0 bottom-0"
            >
              <FontAwesome5
                name="edit"
                size={22}
                color="white"
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

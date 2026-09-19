import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Content } from "../../../types/content";


interface Props {
  item: Content;
  onPress?: () => void;
}

export default function ContentCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white"
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="h-48 w-full bg-gray-100"
        resizeMode="cover"
      />

      <View className="p-4">
        <View className="mb-2 flex-row items-center">
          <View className="rounded-full bg-primary-light px-3 py-1">
            <Text className="text-xs font-semibold text-primary">
              {item.interest || "Recommended"}
            </Text>
          </View>

          <View className="ml-auto">
            <Ionicons
              name="bookmark-outline"
              size={20}
              color="#199690"
            />
          </View>
        </View>

        <Text
          numberOfLines={2}
          className="text-[16px] font-bold leading-6 text-[#172121]"
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-2 text-sm text-[#687474]"
        >
          {item.channelTitle || "YouTube"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
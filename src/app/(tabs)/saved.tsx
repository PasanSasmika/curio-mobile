import {
  SafeAreaView,
  View,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-6">
        <Text className="text-sm font-medium text-primary">
          YOUR LIBRARY
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Saved for later
        </Text>

        <View className="mt-10 flex-1 items-center justify-center pb-20">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-light">
            <Ionicons
              name="bookmark-outline"
              size={34}
              color="#199690"
            />
          </View>

          <Text className="mt-5 text-xl font-bold text-[#172121]">
            Nothing saved yet
          </Text>

          <Text className="mt-2 max-w-[280px] text-center leading-5 text-[#687474]">
            Save useful videos while browsing and come
            back to them when you have free time.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
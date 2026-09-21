import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const PRIMARY = "#199690";

const pages = [
  {
    title: "Discover what interests you",
    description:
      "Tell Curio what you're interested in and discover useful videos from YouTube based on the topics you care about.",
    icon: "sparkles-outline" as const,
  },
  {
    title: "Save it for your free time",
    description:
      "Found something useful but don't have time right now? Save it in Curio and come back to it whenever you're ready.",
    icon: "bookmark-outline" as const,
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const page = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

const handleNext = async () => {
  if (!isLastPage) {
    setCurrentPage((prev) => prev + 1);
    return;
  }

  await AsyncStorage.setItem(
    "@curio_has_seen_onboarding",
    "true"
  );

  router.replace("/(tabs)/home");
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Logo */}
        <View className="items-center pt-16">
          <Image
            source={require("../../assets/images/splash-icon.png")}
            className="h-24 w-48"
            resizeMode="contain"
          />
        </View>

        {/* Illustration */}
        <View className="mt-16 items-center">
          <View className="h-32 w-32 items-center justify-center rounded-[40px] bg-[#E8F7F5]">
            <Ionicons
              name={page.icon}
              size={58}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* Content */}
        <View className="mt-12 items-center px-4">
          <Text className="text-center text-[30px] font-bold leading-9 text-[#172121]">
            {page.title}
          </Text>

          <Text className="mt-5 text-center text-[16px] leading-6 text-[#687474]">
            {page.description}
          </Text>
        </View>

        {/* Bottom */}
        <View className="mt-auto pb-8">
          {/* Page indicators */}
          <View className="mb-7 flex-row justify-center">
            {pages.map((_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 rounded-full ${
                  index === currentPage
                    ? "w-7 bg-primary"
                    : "w-2 bg-[#D8E3E3]"
                }`}
              />
            ))}
          </View>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            className="h-14 flex-row items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="text-[16px] font-bold text-white">
              {isLastPage ? "Get Started" : "Continue"}
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
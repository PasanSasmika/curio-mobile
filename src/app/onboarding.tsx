import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const PRIMARY = "#199690";
const PRIMARY_DARK = "#0E6B66";

const pages = [
  {
    title: "Discover what sparks\nyour curiosity",
    description: "Find useful YouTube videos tailored to the topics you care about",
  },
  {
    title: "Save it for later",
    description: "Keep valuable content and return whenever you're ready to learn",
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

    await AsyncStorage.setItem("@curio_has_seen_onboarding", "true");
    router.replace("/(tabs)/home");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          {/* Logo as central image */}
          <View className="flex-1 items-center justify-center pt-6">
            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={{
                width: width * 0.72,
                height: width * 0.72,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Content */}
          <View className="pb-6">
            <Text className="text-center text-[28px] font-bold leading-[34px] text-[#111827]">
              {page.title}
            </Text>

            <Text className="mt-3 text-center text-[15px] leading-6 text-[#6B7280] px-4">
              {page.description}
            </Text>
          </View>

          {/* Unique bottom indicator + button area */}
          <View className="pb-10">
            {/* Custom indicator inspired by the reference */}
            <View className="mb-8 flex-row items-center justify-between px-2">
              {/* Left dots */}
              <View className="flex-row items-center gap-1.5">
                {pages.map((_, index) => (
                  <View
                    key={index}
                    className="rounded-full"
                    style={{
                      width: index === currentPage ? 18 : 6,
                      height: 6,
                      backgroundColor:
                        index === currentPage ? "#111827" : "#D1D5DB",
                    }}
                  />
                ))}
              </View>

              {/* Right numbered circle */}
              <View className="relative">
                {/* Curved line effect (simple version) */}
                <View
                  className="absolute -left-8 top-1/2 h-0.5 w-8"
                  style={{ backgroundColor: "#111827", opacity: 0.15 }}
                />
                <View
                  className="h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#111827" }}
                >
                  <Text className="text-[16px] font-bold text-white">
                    {currentPage + 1}
                  </Text>
                </View>
              </View>
            </View>

            {/* Gradient Continue button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleNext}
              className="overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={[PRIMARY, PRIMARY_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 56,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Text className="text-[16px] font-semibold text-white">
                  {isLastPage ? "Get Started" : "Continue"}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 8 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
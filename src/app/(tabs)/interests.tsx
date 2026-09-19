import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { discoverContent } from "../../../services/contentservices";

const interests = [
  {
    title: "React Native",
    icon: "phone-portrait-outline",
  },
  {
    title: "Node.js",
    icon: "server-outline",
  },
  {
    title: "Express.js",
    icon: "flash-outline",
  },
  {
    title: "MongoDB",
    icon: "leaf-outline",
  },
  {
    title: "Mobile Development",
    icon: "phone-portrait-outline",
  },
  {
    title: "Full-Stack Development",
    icon: "layers-outline",
  },
];

export default function InterestsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleInterest = (title: string) => {
    setSelected((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  const discover = async () => {
    if (selected.length === 0) {
      Alert.alert(
        "Select an interest",
        "Choose at least one topic to discover content."
      );

      return;
    }

    try {
      setLoading("discover");

      for (const interest of selected) {
        await discoverContent(interest);
      }

      Alert.alert(
        "Discovery complete",
        `New content was found for ${selected.length} interest${
          selected.length > 1 ? "s" : ""
        }.`
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Something went wrong",
        "Could not discover content. Make sure your backend is running."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 130,
        }}
      >
        <Text className="text-sm font-medium text-primary">
          PERSONALIZE
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Your interests
        </Text>

        <Text className="mt-2 leading-5 text-[#687474]">
          Pick the topics you care about. WatchLater will
          use them to find useful YouTube content.
        </Text>

        <View className="mt-8">
          {interests.map((interest) => {
            const isSelected = selected.includes(
              interest.title
            );

            return (
              <TouchableOpacity
                key={interest.title}
                activeOpacity={0.85}
                onPress={() =>
                  toggleInterest(interest.title)
                }
                className={`mb-3 flex-row items-center rounded-2xl border p-4 ${
                  isSelected
                    ? "border-primary bg-primary-light"
                    : "border-gray-100 bg-white"
                }`}
              >
                <View
                  className={`h-12 w-12 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-primary"
                      : "bg-primary-light"
                  }`}
                >
                  <Ionicons
                    name={interest.icon as any}
                    size={22}
                    color={
                      isSelected ? "#FFFFFF" : "#199690"
                    }
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-base font-bold text-[#172121]">
                    {interest.title}
                  </Text>

                  <Text className="mt-1 text-xs text-[#687474]">
                    Discover useful content
                  </Text>
                </View>

                <Ionicons
                  name={
                    isSelected
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={24}
                  color="#199690"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading !== null}
          onPress={discover}
          className="mt-4 h-14 flex-row items-center justify-center rounded-2xl bg-primary"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="sparkles"
                size={20}
                color="#FFFFFF"
              />

              <Text className="ml-2 text-base font-bold text-white">
                Discover Content
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

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
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 110,
        }}
      >
        <Text className="text-sm font-medium text-primary">
          PERSONALIZE
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Your interests
        </Text>

        <Text className="mt-2 leading-5 text-[#687474]">
          Select the topics you want WatchLater to
          discover content about.
        </Text>

        <View className="mt-8">
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.title}
              activeOpacity={0.85}
              className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                <Ionicons
                  name={interest.icon as any}
                  size={22}
                  color="#199690"
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
                name="checkmark-circle"
                size={23}
                color="#199690"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
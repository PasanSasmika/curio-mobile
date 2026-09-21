import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const ONBOARDING_KEY = "@curio_has_seen_onboarding";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(
          ONBOARDING_KEY
        );

        setHasSeenOnboarding(value === "true");
      } catch (error) {
        console.log(
          "Failed to check onboarding status:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fffff9]">
        <ActivityIndicator
          size="large"
          color="#199690"
        />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
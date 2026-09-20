import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Content } from "../../../types/content";
import { getSavedContent } from "../../../services/savedservices";
import ContentCard from "../components/ContentCards";

export default function SavedScreen() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSaved = async () => {
    try {
      setLoading(true);

      const data = await getSavedContent();

      setContent(data);
    } catch (error) {
      console.log("Failed to load saved content:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  const refresh = async () => {
    setRefreshing(true);

    await loadSaved();

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fffff9]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 110,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#199690"
          />
        }
      >
        <Text className="text-sm font-medium text-primary">
          YOUR LIBRARY
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Saved for later
        </Text>

        <Text className="mt-2 text-sm leading-5 text-[#687474]">
          Videos you've decided to come back to.
        </Text>

        {loading && (
          <View className="items-center py-20">
            <ActivityIndicator
              size="large"
              color="#199690"
            />

            <Text className="mt-4 text-sm text-[#687474]">
              Loading your saved videos...
            </Text>
          </View>
        )}

        {!loading && content.length > 0 && (
          <View className="mt-7">
            {content.map((item) => (
              <ContentCard
                key={item.videoId}
                item={item}
              />
            ))}
          </View>
        )}

        {!loading && content.length === 0 && (
          <View className="mt-20 items-center px-6">
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

            <Text className="mt-2 text-center leading-5 text-[#687474]">
              Save useful videos while browsing and
              come back to them when you have free
              time.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Content } from "../../../types/content";
import { getContent, searchContent } from "../../../services/contentservices";
import InterestChip from "../components/InterestChip";
import ContentCard from "../components/ContentCards";
import SearchBar from "../components/SearchBar";


const interests = [
  "All",
  "React Native",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mobile Development",
];

export default function HomeScreen() {

const [searchQuery, setSearchQuery] = useState("");
const [searching, setSearching] = useState(false);

  const [selectedInterest, setSelectedInterest] =
    useState("All");

  const [content, setContent] = useState<Content[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      setLoading(true);

      const data = await getContent(
        selectedInterest === "All"
          ? undefined
          : selectedInterest
      );

      setContent(data);
    } catch (error) {
      console.log(
        "Failed to load content:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [selectedInterest]);

  const refresh = async () => {
    setRefreshing(true);

    await loadContent();

    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
  setSearchQuery(query);

  if (!query.trim()) {
    loadContent();
    return;
  }

  try {
    setSearching(true);

    const results = await searchContent(query);

    setContent(results);
  } catch (error) {
    console.log("Search failed:", error);
  } finally {
    setSearching(false);
  }
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
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
        {/* Header */}
        <View className="px-5 pb-5 pt-4">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-sm font-medium text-primary">
                WATCHLATER
              </Text>

              <Text className="mt-1 text-3xl font-bold text-[#172121]">
                Find something
              </Text>

              <Text className="text-3xl font-bold text-[#172121]">
                worth watching.
              </Text>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
              <Ionicons
                name="play"
                size={21}
                color="#199690"
              />
            </View>
          </View>
        </View>

        <View className="px-5">
  <SearchBar
    value={searchQuery}
    onChangeText={handleSearch}
    onClear={() => {
      setSearchQuery("");
      loadContent();
    }}
  />
</View>

        {/* Interests */}
        <View className="mb-6">
          <View className="mb-3 px-5">
            <Text className="text-base font-bold text-[#172121]">
              Your interests
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {interests.map((interest) => (
              <InterestChip
                key={interest}
                title={interest}
                active={
                  selectedInterest === interest
                }
                onPress={() =>
                  setSelectedInterest(interest)
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Feed */}
        <View className="px-5">
          <View className="mb-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-xl font-bold text-[#172121]">
                For you
              </Text>

              <Text className="mt-1 text-sm text-[#687474]">
                Fresh content based on your interests
              </Text>
            </View>

            {!loading && (
              <View className="rounded-full bg-primary-light px-3 py-1">
                <Text className="text-xs font-semibold text-primary">
                  {content.length} videos
                </Text>
              </View>
            )}
          </View>

          {/* Loading */}
          {loading && (
            <View className="items-center py-16">
              <ActivityIndicator
                size="large"
                color="#199690"
              />

              <Text className="mt-4 text-sm text-[#687474]">
                Finding something useful...
              </Text>
            </View>
          )}

          {/* Content */}
          {!loading &&
            content.map((item) => (
              <ContentCard
                key={item.videoId}
                item={item}
              />
            ))}

          {/* Empty */}
          {!loading && content.length === 0 && (
            <View className="items-center rounded-3xl bg-[#F8FAFA] px-6 py-12">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
                <Ionicons
                  name="sparkles-outline"
                  size={26}
                  color="#199690"
                />
              </View>

              <Text className="text-center text-lg font-bold text-[#172121]">
                Nothing here yet
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-[#687474]">
                Go to Interests and discover some useful
                content.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
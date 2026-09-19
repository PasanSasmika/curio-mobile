import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { Content } from "../../../types/content";
import { api } from "../../../services/api";
import { checkSavedContent, removeSavedContent, saveContent } from "../../../services/savedservices";


export default function VideoDetailsScreen() {

const [saved, setSaved] = useState(false);
const [saving, setSaving] = useState(false);


  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [video, setVideo] = useState<Content | null>(
    null
  );

  const toggleSaved = async () => {
  if (!video || saving) return;

  try {
    setSaving(true);

    if (saved) {
      await removeSavedContent(video.videoId);
      setSaved(false);
    } else {
      await saveContent(video);
      setSaved(true);
    }
  } catch (error) {
    console.log("Failed to update saved state:", error);
  } finally {
    setSaving(false);
  }
};

  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadVideo = async () => {
    try {
      setLoading(true);

      const response = await api.get("/content");

      const foundVideo = response.data.data?.find(
        (item: Content) => item.videoId === id
      );

      setVideo(foundVideo || null);

      if (foundVideo) {
        const isSaved = await checkSavedContent(
          foundVideo.videoId
        );

        setSaved(isSaved);
      }
    } catch (error) {
      console.log("Failed to load video:", error);
    } finally {
      setLoading(false);
    }
  };

  loadVideo();
}, [id]);

  const openYouTube = async () => {
    if (!video) return;

    const url = `https://www.youtube.com/watch?v=${video.videoId}`;

    await Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator
          size="large"
          color="#199690"
        />
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-[#172121]">
            Video not found
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-5 rounded-xl bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-white">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7F7]"
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#172121"
            />
          </TouchableOpacity>

          <Text className="ml-4 text-lg font-bold text-[#172121]">
            Video
          </Text>
        </View>

        {/* Thumbnail */}
        <Image
          source={{ uri: video.thumbnail }}
          className="h-56 w-full bg-gray-100"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="px-5 pt-5">
          <View className="flex-row items-center">
            <View className="rounded-full bg-primary-light px-3 py-1">
              <Text className="text-xs font-semibold text-primary">
                {video.interest || "Recommended"}
              </Text>
            </View>

            <Text className="ml-3 text-xs text-[#687474]">
              YouTube
            </Text>
          </View>

          <Text className="mt-4 text-2xl font-bold leading-8 text-[#172121]">
            {video.title}
          </Text>

          <Text className="mt-2 text-sm font-medium text-[#687474]">
            {video.channelTitle}
          </Text>

          {/* Actions */}
          <View className="mt-6 flex-row">
            <TouchableOpacity
              onPress={openYouTube}
              activeOpacity={0.85}
              className="mr-3 flex-1 flex-row items-center justify-center rounded-2xl bg-primary py-4"
            >
              <Ionicons
                name="logo-youtube"
                size={20}
                color="#FFFFFF"
              />

              <Text className="ml-2 font-bold text-white">
                Watch on YouTube
              </Text>
            </TouchableOpacity>

           <TouchableOpacity
  activeOpacity={0.85}
  onPress={toggleSaved}
  disabled={saving}
  className={`h-14 w-14 items-center justify-center rounded-2xl ${
    saved
      ? "bg-primary"
      : "border border-gray-200 bg-white"
  }`}
>
  {saving ? (
    <ActivityIndicator
      size="small"
      color={saved ? "#FFFFFF" : "#199690"}
    />
  ) : (
    <Ionicons
      name={saved ? "bookmark" : "bookmark-outline"}
      size={22}
      color={saved ? "#FFFFFF" : "#199690"}
    />
  )}
</TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-[#172121]">
              About this video
            </Text>

            <Text className="mt-3 text-sm leading-6 text-[#687474]">
              {video.description ||
                "No description available for this video."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
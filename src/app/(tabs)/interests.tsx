import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Interest } from "../../../types/interest";
import { getInterests } from "../../../services/interestService";
import { discoverContent } from "../../../services/contentservices";


export default function InterestsScreen() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState("");
  const loadInterests = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getInterests();

    console.log("INTERESTS:", data);

    setInterests(data);
  } catch (error: any) {
    console.log(
      "Failed to load interests:",
      error?.response?.data || error?.message || error
    );

    setError(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to load interests"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadInterests();
  }, []);

  const toggleInterest = (name: string) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  const filteredInterests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return interests;
    }

    return interests.filter((interest) =>
      interest.name.toLowerCase().includes(query)
    );
  }, [interests, search]);

  const groupedInterests = useMemo(() => {
    return filteredInterests.reduce(
      (groups, interest) => {
        if (!groups[interest.category]) {
          groups[interest.category] = [];
        }

        groups[interest.category].push(interest);

        return groups;
      },
      {} as Record<string, Interest[]>
    );
  }, [filteredInterests]);

  const handleDiscover = async () => {
    if (selected.length === 0) {
      return;
    }

    try {
      setDiscovering(true);

      for (const interest of selected) {
        await discoverContent(interest);
      }

      console.log("Content discovered successfully");
    } catch (error) {
      console.log("Failed to discover content:", error);
    } finally {
      setDiscovering(false);
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
          DISCOVER
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Choose your interests
        </Text>

        <Text className="mt-2 text-sm leading-5 text-[#687474]">
          Pick the topics you want Curio to discover for you.
        </Text>

        {/* Search */}
        <View className="mt-6 flex-row items-center rounded-2xl border border-gray-100 bg-[#F8FAFA] px-4">
          <Ionicons
            name="search-outline"
            size={20}
            color="#687474"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search interests..."
            placeholderTextColor="#98A3A3"
            className="ml-3 h-14 flex-1 text-[15px] text-[#172121]"
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#98A3A3"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Selected */}
        {selected.length > 0 && (
          <View className="mt-6">
            <View className="mb-3 flex-row items-center">
              <Text className="text-base font-bold text-[#172121]">
                Your interests
              </Text>

              <View className="ml-2 rounded-full bg-primary-light px-2.5 py-1">
                <Text className="text-xs font-semibold text-primary">
                  {selected.length}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              {selected.map((name) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => toggleInterest(name)}
                  className="mb-2 mr-2 flex-row items-center rounded-full bg-primary px-4 py-2.5"
                >
                  <Text className="text-sm font-semibold text-white">
                    {name}
                  </Text>

                  <Ionicons
                    name="close"
                    size={15}
                    color="#FFFFFF"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Interests */}
        <View className="mt-7">
          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator
                size="large"
                color="#199690"
              />

              <Text className="mt-4 text-sm text-[#687474]">
                Loading interests...
              </Text>
            </View>
          ) : (
            Object.entries(groupedInterests).map(
              ([category, items]) => (
                <View key={category} className="mb-7">
                  <Text className="mb-3 text-base font-bold text-[#172121]">
                    {category}
                  </Text>

                  <View className="flex-row flex-wrap">
                    {items.map((interest) => {
                      const active = selected.includes(
                        interest.name
                      );

                      return (
                        <TouchableOpacity
                          key={interest._id}
                          onPress={() =>
                            toggleInterest(interest.name)
                          }
                          activeOpacity={0.8}
                          className={`mb-2 mr-2 rounded-full border px-4 py-2.5 ${
                            active
                              ? "border-primary bg-primary"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              active
                                ? "text-white"
                                : "text-[#687474]"
                            }`}
                          >
                            {interest.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )
            )
          )}
          {!loading && error && (
  <View className="items-center py-16">
    <Ionicons
      name="cloud-offline-outline"
      size={40}
      color="#D9534F"
    />

    <Text className="mt-4 text-center text-base font-bold text-[#172121]">
      Couldn't load interests
    </Text>

    <Text className="mt-2 text-center text-sm text-[#687474]">
      {error}
    </Text>
  </View>
)}
        </View>
      </ScrollView>

      {/* Discover button */}
      {selected.length > 0 && (
        <View className="absolute bottom-20 left-5 right-5">
          <TouchableOpacity
            onPress={handleDiscover}
            disabled={discovering}
            activeOpacity={0.85}
            className="h-14 flex-row items-center justify-center rounded-2xl bg-primary"
          >
            {discovering ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={19}
                  color="#FFFFFF"
                />

                <Text className="ml-2 text-base font-bold text-white">
                  Discover Content
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
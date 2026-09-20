import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import { Interest } from "../../../types/interest";

import {
  getInterests,
  searchInterests,
} from "../../../services/interestService";

import {
  getPreferences,
  updatePreferences,
} from "../../../services/preferencesService";

import { discoverContent } from "../../../services/contentservices";

export default function InterestsScreen() {
  const [interests, setInterests] =
    useState<Interest[]>([]);

  const [suggestions, setSuggestions] =
    useState<Interest[]>([]);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [searching, setSearching] =
    useState(false);

  const [discovering, setDiscovering] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // Load interests + preferences
  // --------------------------------------------------

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const interestData =
        await getInterests();

      setInterests(interestData);

      try {
        const preferences =
          await getPreferences();

        setSelected(
          preferences.interests || []
        );
      } catch (preferencesError) {
        console.log(
          "Failed to load preferences:",
          preferencesError
        );

        setSelected([]);
      }
    } catch (error) {
      console.log(
        "Failed to load interests:",
        error
      );

      setError(
        "Couldn't load interests. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Search YouTube-powered suggestions
  // --------------------------------------------------

  useEffect(() => {
    const query = search.trim();

    /*
     * Don't call the API for one-character searches.
     */
    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    /*
     * Wait until the user pauses typing before
     * calling the backend.
     */
    const timer = setTimeout(
      async () => {
        try {
          setSearching(true);

          const results =
            await searchInterests(query);

          setSuggestions(results);
        } catch (error) {
          console.log(
            "Failed to search YouTube suggestions:",
            error
          );

          setSuggestions([]);
        } finally {
          setSearching(false);
        }
      },
      500
    );

    return () =>
      clearTimeout(timer);
  }, [search]);

  // --------------------------------------------------
  // Toggle selected interest
  // --------------------------------------------------

  const toggleInterest = (
    name: string
  ) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter(
            (item) => item !== name
          )
        : [...current, name]
    );
  };

  // --------------------------------------------------
  // Select YouTube suggestion
  // --------------------------------------------------

  const selectSuggestion = (
    name: string
  ) => {
    if (!selected.includes(name)) {
      setSelected((current) => [
        ...current,
        name,
      ]);
    }

    setSearch("");
    setSuggestions([]);
  };

  // --------------------------------------------------
  // Existing interest filtering
  // --------------------------------------------------

  const filteredInterests =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return interests;
      }

      return interests.filter(
        (interest) =>
          interest.name
            .toLowerCase()
            .includes(query)
      );
    }, [interests, search]);

  // --------------------------------------------------
  // Group existing interests
  // --------------------------------------------------

  const groupedInterests =
    useMemo(() => {
      return filteredInterests.reduce(
        (groups, interest) => {
          if (
            !groups[interest.category]
          ) {
            groups[interest.category] = [];
          }

          groups[interest.category].push(
            interest
          );

          return groups;
        },
        {} as Record<
          string,
          Interest[]
        >
      );
    }, [filteredInterests]);

  // --------------------------------------------------
  // Discover content
  // --------------------------------------------------

  const handleDiscover =
    async () => {
      if (
        selected.length === 0 ||
        discovering
      ) {
        return;
      }

      try {
        setDiscovering(true);

        // Save selected interests
        await updatePreferences(
          selected
        );

        // Discover YouTube content
        for (
          const interest of selected
        ) {
          await discoverContent(
            interest
          );
        }

        console.log(
          "Preferences and content updated successfully"
        );
      } catch (error) {
        console.log(
          "Failed to update preferences/content:",
          error
        );
      } finally {
        setDiscovering(false);
      }
    };

  return (
    <SafeAreaView className="flex-1 bg-[#fffff9]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 140,
        }}
      >
        {/* Header */}

        <Text className="text-sm font-medium text-primary">
          DISCOVER
        </Text>

        <Text className="mt-2 text-3xl font-bold text-[#172121]">
          Choose your interests
        </Text>

        <Text className="mt-2 text-sm leading-5 text-[#687474]">
          Pick the topics you want Curio
          to discover for you.
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
            placeholder="Search anything..."
            placeholderTextColor="#98A3A3"
            autoCorrect={false}
            returnKeyType="search"
            className="ml-3 h-14 flex-1 text-[15px] text-[#172121]"
          />

          {searching ? (
            <ActivityIndicator
              size="small"
              color="#199690"
            />
          ) : search.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setSuggestions([]);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#98A3A3"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* YouTube Suggestions */}

        {search.trim().length >= 2 &&
          suggestions.length > 0 && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <Text className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-[#98A3A3]">
                From YouTube
              </Text>

              {suggestions.map(
                (suggestion) => {
                  const active =
                    selected.includes(
                      suggestion.name
                    );

                  return (
                    <TouchableOpacity
                      key={
                        suggestion._id
                      }
                      onPress={() =>
                        selectSuggestion(
                          suggestion.name
                        )
                      }
                      activeOpacity={0.75}
                      className="flex-row items-center border-t border-gray-100 px-4 py-3.5"
                    >
                      {/* Icon */}

                      <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
                        <Ionicons
                          name="logo-youtube"
                          size={18}
                          color="#199690"
                        />
                      </View>

                      {/* Suggestion */}

                      <View className="ml-3 flex-1">
                        <Text
                          numberOfLines={2}
                          className="text-sm font-semibold leading-5 text-[#172121]"
                        >
                          {
                            suggestion.name
                          }
                        </Text>

                        <Text className="mt-0.5 text-xs text-[#98A3A3]">
                          YouTube
                        </Text>
                      </View>

                      {/* Selected state */}

                      <Ionicons
                        name={
                          active
                            ? "checkmark-circle"
                            : "add-circle-outline"
                        }
                        size={22}
                        color={
                          active
                            ? "#199690"
                            : "#98A3A3"
                        }
                      />
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          )}

        {/* No YouTube results */}

        {search.trim().length >= 2 &&
          !searching &&
          suggestions.length === 0 && (
            <View className="mt-2 rounded-2xl bg-[#F8FAFA] px-4 py-3">
              <Text className="text-sm text-[#687474]">
                No YouTube suggestions found.
                You can still use your search
                topic as an interest.
              </Text>

              <TouchableOpacity
                onPress={() =>
                  selectSuggestion(
                    search.trim()
                  )
                }
                activeOpacity={0.8}
                className="mt-3 flex-row items-center"
              >
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
                  <Ionicons
                    name="add"
                    size={18}
                    color="#199690"
                  />
                </View>

                <Text className="ml-3 text-sm font-semibold text-primary">
                  Add "{search.trim()}"
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* Selected interests */}

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
              {selected.map(
                (name) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() =>
                      toggleInterest(
                        name
                      )
                    }
                    activeOpacity={0.8}
                    className="mb-2 mr-2 flex-row items-center rounded-full bg-primary px-4 py-2.5"
                  >
                    <Text className="text-sm font-semibold text-white">
                      {name}
                    </Text>

                    <Ionicons
                      name="close"
                      size={15}
                      color="#FFFFFF"
                      style={{
                        marginLeft: 6,
                      }}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}

        {/* Existing interests */}

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
          ) : error ? (
            <View className="items-center rounded-3xl bg-[#F8FAFA] px-6 py-14">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#FDECEC]">
                <Ionicons
                  name="cloud-offline-outline"
                  size={30}
                  color="#D9534F"
                />
              </View>

              <Text className="mt-5 text-center text-lg font-bold text-[#172121]">
                Couldn't load interests
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-[#687474]">
                {error}
              </Text>

              <TouchableOpacity
                onPress={loadData}
                activeOpacity={0.85}
                className="mt-5 rounded-xl bg-primary px-5 py-3"
              >
                <Text className="font-semibold text-white">
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(
              groupedInterests
            ).map(
              ([
                category,
                items,
              ]) => (
                <View
                  key={category}
                  className="mb-7"
                >
                  <Text className="mb-3 text-base font-bold text-[#172121]">
                    {category}
                  </Text>

                  <View className="flex-row flex-wrap">
                    {items.map(
                      (interest) => {
                        const active =
                          selected.includes(
                            interest.name
                          );

                        return (
                          <TouchableOpacity
                            key={
                              interest._id
                            }
                            onPress={() =>
                              toggleInterest(
                                interest.name
                              )
                            }
                            activeOpacity={
                              0.8
                            }
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
                              {
                                interest.name
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
              )
            )
          )}
        </View>
      </ScrollView>

      {/* Discover button */}

      {selected.length > 0 && (
        <View className="absolute bottom-20 left-5 right-5">
          <TouchableOpacity
            onPress={
              handleDiscover
            }
            disabled={discovering}
            activeOpacity={0.85}
            className={`h-14 flex-row items-center justify-center rounded-2xl ${
              discovering
                ? "bg-[#8BC9C6]"
                : "bg-primary"
            }`}
          >
            {discovering ? (
              <>
                <ActivityIndicator color="#FFFFFF" />

                <Text className="ml-2 text-base font-bold text-white">
                  Discovering...
                </Text>
              </>
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
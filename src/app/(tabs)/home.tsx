import {View,Text,ScrollView,SafeAreaView,RefreshControl,ActivityIndicator,TouchableOpacity,} from "react-native";
import {useCallback,useEffect,useRef,useState,} from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Content } from "../../../types/content";
import {ContentSort,getContent,searchContent,} from "../../../services/contentservices";
import InterestChip from "../components/InterestChip";
import ContentCard from "../components/ContentCards";
import SearchBar from "../components/SearchBar";

import { getPreferences } from "../../../services/preferencesService";

const ITEMS_PER_PAGE = 10;
const MAX_PAGES = 6;

const SORT_FILTERS: { label: string; value: ContentSort }[] = [
  { label: "New", value: "new" },
  { label: "Most viewed", value: "viewed" },
  { label: "Recently added", value: "recent" },
];

export default function HomeScreen() {
  const [interests, setInterests] =
    useState<string[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [selectedInterest, setSelectedInterest] =
    useState("All");

  const [content, setContent] =
    useState<Content[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [sort, setSort] =
    useState<ContentSort>("new");

  const requestId = useRef(0);

  // --------------------------------------------------
  // Load user's saved interests
  // --------------------------------------------------

  const loadPreferences = async () => {
    try {
      const preferences =
        await getPreferences();

      setInterests(
        preferences.interests || []
      );
    } catch (error) {
      console.log(
        "Failed to load preferences:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Load paginated content
  // --------------------------------------------------

  const loadContent = async (
    page = 1,
    refresh = false
  ) => {
    const id = ++requestId.current;

    try {
      setLoading(true);

      const response =
        await getContent(
          selectedInterest === "All"
            ? undefined
            : selectedInterest,
          page,
          ITEMS_PER_PAGE,
          refresh,
          sort
        );

      if (id !== requestId.current) {
        return;
      }

      setContent(response.data);

      setCurrentPage(
        response.pagination.page
      );

      setTotalPages(
        Math.min(
          response.pagination.totalPages,
          MAX_PAGES
        )
      );
    } catch (error) {
      console.log(
        "Failed to load content:",
        error
      );
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  };

  // --------------------------------------------------
  // Search content
  // --------------------------------------------------

  const runSearch = async (
    query: string
  ) => {
    const id = ++requestId.current;

    try {
      setSearching(true);
      setLoading(true);

      const response =
        await searchContent(query);

      if (id !== requestId.current) {
        return;
      }

      setContent(response.data);

      setCurrentPage(1);

      setTotalPages(1);
    } catch (error) {
      console.log(
        "Search failed:",
        error
      );
    } finally {
      if (id === requestId.current) {
        setSearching(false);
        setLoading(false);
      }
    }
  };

  // --------------------------------------------------
  // Initial preferences
  // --------------------------------------------------

  useEffect(() => {
    loadPreferences();
  }, []);

  // --------------------------------------------------
  // Reload preferences when returning from Discover
  // --------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, [])
  );

  // --------------------------------------------------
  // Load page 1 when interest changes
  // --------------------------------------------------

  useEffect(() => {
    if (searchQuery.trim()) {
      return;
    }

    setCurrentPage(1);

    loadContent(1, false);
  }, [selectedInterest, sort]);

  // --------------------------------------------------
  // Refresh
  // --------------------------------------------------

  const refresh = async () => {
    setRefreshing(true);

    try {
      await loadPreferences();

      const query =
        searchQuery.trim();

      if (query) {
        await runSearch(query);
      } else {
        setCurrentPage(1);

        /*
         * refresh=true tells the backend to fetch
         * newer YouTube uploads before returning
         * page 1.
         */
        await loadContent(1, true);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // Change page
  // --------------------------------------------------

  const changePage = async (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      loading
    ) {
      return;
    }

    /*
     * Scroll position will naturally remain near
     * the feed. We first show loading and then
     * replace the current page.
     */

    await loadContent(
      page,
      false
    );
  };

  // --------------------------------------------------
  // Search button / keyboard
  // --------------------------------------------------

  const handleSearch = () => {
    const query =
      searchQuery.trim();

    if (!query) {
      setCurrentPage(1);
      loadContent(1, false);
      return;
    }

    runSearch(query);
  };

  // --------------------------------------------------
  // Clear search
  // --------------------------------------------------

  const handleClearSearch = () => {
    setSearchQuery("");

    setCurrentPage(1);

    loadContent(1, false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3eb]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
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
                CURIO
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

        {/* Search */}

        <View className="px-5">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            loading={searching}
            onClear={handleClearSearch}
          />
        </View>

        {/* Interests */}

        <View className="mb-6">
          <View className="mb-3 px-5">
            <Text className="text-base font-bold text-[#172121]">
              Your interests
            </Text>
          </View>

          {interests.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
            >
              {["All", ...interests].map(
                (interest) => (
                  <InterestChip
                    key={interest}
                    title={interest}
                    active={
                      selectedInterest ===
                      interest
                    }
                    onPress={() => {
                      setSearchQuery("");

                      setCurrentPage(1);

                      setSelectedInterest(
                        interest
                      );
                    }}
                  />
                )
              )}
            </ScrollView>
          ) : (
            <View className="px-5">
              <View className="rounded-2xl bg-[#F8FAFA] px-4 py-4">
                <Text className="text-sm text-[#687474]">
                  Choose some interests to
                  personalize your feed.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Sort filters */}

        {!searchQuery.trim() && (
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
            >
              {SORT_FILTERS.map((filter) => (
                <InterestChip
                  key={filter.value}
                  title={filter.label}
                  active={sort === filter.value}
                  onPress={() => setSort(filter.value)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Feed */}

        <View className="px-5">
          <View className="mb-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-xl font-bold text-[#172121]">
                {searchQuery.trim()
                  ? "Search results"
                  : selectedInterest === "All"
                  ? "For you"
                  : selectedInterest}
              </Text>

              <Text className="mt-1 text-sm text-[#687474]">
                {searchQuery.trim()
                  ? `Results for "${searchQuery.trim()}"`
                  : "Fresh content based on your interests"}
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

          {!loading &&
            content.length === 0 && (
              <View className="items-center rounded-3xl bg-[#F8FAFA] px-6 py-12">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
                  <Ionicons
                    name={
                      searchQuery.trim()
                        ? "search-outline"
                        : "sparkles-outline"
                    }
                    size={26}
                    color="#199690"
                  />
                </View>

                <Text className="text-center text-lg font-bold text-[#172121]">
                  {searchQuery.trim()
                    ? "No videos found"
                    : "Nothing here yet"}
                </Text>

                <Text className="mt-2 text-center text-sm leading-5 text-[#687474]">
                  {searchQuery.trim()
                    ? "Try searching for another topic or keyword."
                    : "Go to Interests and discover some useful content."}
                </Text>
              </View>
            )}

          {/* Pagination */}

          {!loading &&
            !searchQuery.trim() &&
            totalPages > 1 && (
              <View className="mt-7 mb-4">
                <View className="flex-row items-center justify-center">
                  {/* Previous */}

                  <TouchableOpacity
                    onPress={() =>
                      changePage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    activeOpacity={0.75}
                    className={`mr-2 h-10 w-10 items-center justify-center rounded-xl border ${
                      currentPage === 1
                        ? "border-gray-100 bg-[#F8FAFA]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={18}
                      color={
                        currentPage === 1
                          ? "#C5CCCC"
                          : "#172121"
                      }
                    />
                  </TouchableOpacity>

                  {/* Pages 1–6 */}

                  {Array.from(
                    {
                      length: Math.min(
                        totalPages,
                        MAX_PAGES
                      ),
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => {
                    const active =
                      page ===
                      currentPage;

                    return (
                      <TouchableOpacity
                        key={page}
                        onPress={() =>
                          changePage(
                            page
                          )
                        }
                        activeOpacity={0.75}
                        className={`mx-1 h-10 w-10 items-center justify-center rounded-xl ${
                          active
                            ? "bg-primary"
                            : "border border-gray-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            active
                              ? "text-white"
                              : "text-[#687474]"
                          }`}
                        >
                          {page}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Next */}

                  <TouchableOpacity
                    onPress={() =>
                      changePage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    activeOpacity={0.75}
                    className={`ml-2 h-10 w-10 items-center justify-center rounded-xl border ${
                      currentPage ===
                      totalPages
                        ? "border-gray-100 bg-[#F8FAFA]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        currentPage ===
                        totalPages
                          ? "#C5CCCC"
                          : "#172121"
                      }
                    />
                  </TouchableOpacity>
                </View>

                <Text className="mt-3 text-center text-xs text-[#98A3A3]">
                  Page {currentPage} of{" "}
                  {totalPages}
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
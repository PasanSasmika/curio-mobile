import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

const TAB_BAR_WIDTH = 335;

function CenteredTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: insets.bottom + 12,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: TAB_BAR_WIDTH,
          height: 72,
          borderRadius: 40,
          paddingHorizontal: 10,
          alignItems: "center",
          backgroundColor: "#172121",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {options.tabBarIcon?.({
                focused,
                color: focused ? "#FFFFFF" : "#D5DADA",
                size: 25,
              })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CenteredTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={25}
              color={focused ? "#FFFFFF" : "#D5DADA"}
            />
          ),
        }}
      />

      {/* INTERESTS */}
      <Tabs.Screen
        name="interests"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "reader" : "reader-outline"}
              size={25}
              color={focused ? "#FFFFFF" : "#D5DADA"}
            />
          ),
        }}
      />

      {/* SAVED */}
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={focused ? "#FFFFFF" : "#D5DADA"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
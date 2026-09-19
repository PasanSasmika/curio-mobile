import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  loading?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  loading = false,
}: Props) {
  return (
    <View className="mb-6 flex-row items-center rounded-2xl border border-gray-100 bg-[#F8FAFA] px-4">
      <TouchableOpacity
        onPress={onSubmit}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#687474"
        />
      </TouchableOpacity>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search topics or videos..."
        placeholderTextColor="#98A3A3"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        className="ml-3 h-14 flex-1 text-[15px] text-[#172121]"
      />

      {loading ? (
        <Ionicons
          name="hourglass-outline"
          size={19}
          color="#199690"
        />
      ) : value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
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
  );
}
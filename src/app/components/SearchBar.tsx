import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
}: Props) {
  return (
    <View className="mb-6 flex-row items-center rounded-2xl border border-gray-100 bg-[#F8FAFA] px-4">
      <Ionicons
        name="search-outline"
        size={20}
        color="#687474"
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search topics or videos..."
        placeholderTextColor="#98A3A3"
        className="ml-3 h-14 flex-1 text-[15px] text-[#172121]"
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons
            name="close-circle"
            size={20}
            color="#98A3A3"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
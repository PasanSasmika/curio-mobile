import { Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  active?: boolean;
  onPress?: () => void;
}

export default function InterestChip({
  title,
  active = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mr-2 rounded-full border px-4 py-2.5 ${
        active
          ? "border-primary bg-primary"
          : "border-gray-200 bg-white"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          active ? "text-white" : "text-[#687474]"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
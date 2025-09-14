import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { buttonStyle } from "./buttonStyle";

interface FlexButtonProps {
  title?: string;
  onPress?: () => void;
}

export const FlexButton: React.FC<FlexButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[buttonStyle.button]} onPress={onPress}>
      {title && <Text style={[buttonStyle.buttonText]}>{title}</Text>}
    </TouchableOpacity>
  );
};

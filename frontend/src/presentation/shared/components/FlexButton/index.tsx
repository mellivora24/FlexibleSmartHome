import React from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

import { buttonStyle } from "./buttonStyle";

interface FlexButtonProps {
  title?: string;
  icon?: ImageSourcePropType;
  style?: object;
  onPress?: () => void;
}

export const FlexButton = ({ title, icon, style, onPress }: FlexButtonProps) => {
  return (
    <TouchableOpacity style={[buttonStyle.button, style]} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        {icon && <Image source={icon} style={{ width: 18, height: 18, alignSelf: 'center'}} />}
        <Text style={buttonStyle.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

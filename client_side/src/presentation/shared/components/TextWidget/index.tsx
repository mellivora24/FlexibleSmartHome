import React from "react";
import { Image, ImageSourcePropType, StyleProp, Text, TextStyle, View } from "react-native";

import { textWidgetStyle } from "./textWidgetStyle";

interface TextWidgetProps {
    text: string;
    icon?: ImageSourcePropType;
    style?: StyleProp<TextStyle>;
    onPress?: () => void;
}

export const TextWidget: React.FC<TextWidgetProps> = ({ text, icon, style, onPress }) => {
    return (
        <View style={[textWidgetStyle.container, style]} onTouchEnd={onPress}>
            {icon && <Image source={icon} style={textWidgetStyle.icon} />}
            <Text style={textWidgetStyle.text} numberOfLines={1} ellipsizeMode="tail">{text}</Text>
        </View>
    );
};

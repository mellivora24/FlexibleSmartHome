import React from "react";
import { Image, ImageSourcePropType, Text, TextInput, View } from "react-native";

import { textFieldStyle } from "./textFieldStyle";

interface TextFieldProps {
    label?: string;
    placeholder?: string;
    icon?: ImageSourcePropType;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    iconPosition?: "left" | "right";
    height?: number;
    width?: number;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    placeholder,
    icon,
    onChangeText,
    secureTextEntry = false,
    iconPosition = "left",
    height = 40,
    width = 333,
}) => {
    return (
        <View style={[textFieldStyle.container, { width }]}>
            {label && <Text style={textFieldStyle.label}>{label}</Text>}
            <View style={textFieldStyle.inputContainer}>
                {icon && iconPosition === "left" && (
                    <Image source={icon} style={textFieldStyle.icon} />
                )}
                <TextInput
                    style={[textFieldStyle.textInput, { height }]}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(179, 179, 179, 0.4)"
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                />
                {icon && iconPosition === "right" && (
                    <Image source={icon} style={textFieldStyle.icon} />
                )}
            </View>
        </View>
    );
}


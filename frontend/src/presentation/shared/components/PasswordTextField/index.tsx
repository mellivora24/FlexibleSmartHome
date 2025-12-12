import React, { useCallback, useState } from "react";
import { Image, ImageSourcePropType, Text, TextInput, TouchableOpacity, View } from "react-native";

import { passwordTextFieldStyle } from "./passwordTextField";

interface PasswordTextFieldProps {
    label?: string;
    hideText?: string;
    showText?: string;
    placeholder?: string;
    icon?: ImageSourcePropType;
    onChangeText?: (text: string) => void;
    height?: number;
    width?: number;
}

export const PasswordTextField: React.FC<PasswordTextFieldProps> = ({
    label,
    hideText = "Hide",
    showText = "Show",
    placeholder,
    icon,
    onChangeText,
    height = 40,
    width = 333,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
        setIsPasswordVisible(prev => !prev);
    }, []);

    return (
        <View style={[passwordTextFieldStyle.container, { width }]}>
            {label && <Text style={passwordTextFieldStyle.label}>{label}</Text>}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[passwordTextFieldStyle.inputContainer, { flex: 1 }]}>
                    {icon && <Image source={icon} style={passwordTextFieldStyle.icon} />}
                    
                    <TextInput
                        style={[passwordTextFieldStyle.textInput, { height }]}
                        placeholder={placeholder}
                        placeholderTextColor="rgba(179, 179, 179, 0.4)"
                        onChangeText={onChangeText}
                        secureTextEntry={!isPasswordVisible}
                    />
                </View>

                <TouchableOpacity onPress={togglePasswordVisibility} style={isPasswordVisible ? passwordTextFieldStyle.hideButton : passwordTextFieldStyle.showButton}>
                    {isPasswordVisible ? (
                        <Text style={passwordTextFieldStyle.hideShowText}>{hideText}</Text>
                    ) : (
                        <Text style={passwordTextFieldStyle.hideShowText}>{showText}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
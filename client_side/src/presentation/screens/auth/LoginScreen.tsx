import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { style } from "./style/login";

export default function LoginScreen() {
    const { t } = useTranslation();
    
    return (
        <View style={style.container}>
            <Text style={style.title}>{t("auth.login")}</Text>
            <TextInput style={style.input} placeholder={t("auth.email")} placeholderTextColor="#888" />
            <TextInput style={style.input} placeholder={t("auth.password")} placeholderTextColor="#888" secureTextEntry />
            <TouchableOpacity style={style.button}>
                <Text style={style.buttonText}>{t("auth.login")}</Text>
            </TouchableOpacity>
        </View>
    );
}

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, KeyboardAvoidingView, ScrollView, Text } from "react-native";

import { FlexButton } from "@components/FlexButton";
import { PasswordTextField } from "@components/PasswordTextField";
import { TextField } from "@components/TextField";
import { ICONS, IMAGES } from "@constants/images";
import { ROUTES } from "@constants/routes";
import { BACKGROUND } from "@theme/colors";
import { style } from "./auth";

export default function LoginScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleRegister() {
        router.replace(ROUTES.AUTH.REGISTER);
    }

    function handleLogin() {
        console.log("Logging in with", email, password);
        // TODO: Implement login logic here
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <LinearGradient
                    colors={BACKGROUND.GRADIENT as [string, string]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={style.container}
                >
                    <Image source={IMAGES.LOGO_ROUNDED} style={style.image} resizeMode="contain" />

                    <Text style={style.title}>{t("auth.login.title")}</Text>

                    <TextField
                        label={t("auth.login.email")}
                        icon={ICONS.EMAIL}
                        placeholder={t("auth.login.emailPlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setEmail}
                    />

                    <PasswordTextField
                        label={t("auth.login.password")}
                        hideText={t("auth.login.buttonHide")}
                        showText={t("auth.login.buttonShow")}
                        icon={ICONS.PASSWORD}
                        placeholder={t("auth.login.passwordPlaceholder")}
                        onChangeText={setPassword}
                    />

                    <Text style={style.text}>
                        {t("auth.login.noAccount")}
                        <Text style={style.link} onPress={handleRegister}>
                            {t("auth.login.registerLink")}
                        </Text>
                    </Text>

                    <FlexButton
                        title={t("auth.login.button")}
                        onPress={handleLogin}
                    />
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
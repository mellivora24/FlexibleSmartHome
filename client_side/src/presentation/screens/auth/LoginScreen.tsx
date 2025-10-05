import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, KeyboardAvoidingView, ScrollView, Text } from "react-native";

import { FlexButton } from "@components/FlexButton";
import { PasswordTextField } from "@components/PasswordTextField";
import { TextField } from "@components/TextField";
import { ICONS, IMAGES } from "@constants/images";
import { ROUTES } from "@constants/routes";
import { useAuthContext } from "@src/presentation/hooks/useContext";
import { BACKGROUND } from "@theme/colors";
import { style } from "./authStyle";
import { useAuthViewModel } from "./AuthViewModel";

export default function LoginScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { login, isLoading, error } = useAuthViewModel();
    const { login: loginContext } = useAuthContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleRegister() {
        router.replace(ROUTES.AUTH.REGISTER);
    }

    async function handleLogin() {
        if (isLoading) return;

        try {
            if (!email || !password) {
                Alert.alert(t("errors.missingFields"));
                return;
            }

            const response = await login({ email, password });
            if (response && typeof response === "object" && "data" in response) {
                await loginContext(response.data as any);
                router.replace(ROUTES.TABS.DASHBOARD);
            } else {
                Alert.alert(t("errors.generic"));
            }
        } catch (err) {
            console.error(err);
            Alert.alert(t("errors.generic"));
        }
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
                    {error && <Text style={style.error}>{error}</Text>}

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
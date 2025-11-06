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
import { useAuthViewModel } from "@hooks/useAuthViewModel";
import { useAuthContext } from "@src/presentation/hooks/useAppContext";
import { BACKGROUND } from "@theme/colors";
import { style } from "./authStyle";

export default function RegisterScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mcuCode, setmcuCode] = useState("");

    const { login: loginContext } = useAuthContext();

    const { register } = useAuthViewModel();

    async function handleRegister() {
        const IntMcuCode = parseInt(mcuCode, 10);
        try {
            const response = await register({ mcu_code: IntMcuCode, name, email, password });
            if ("data" in response) {
                await loginContext(response.data as any);
                router.replace(ROUTES.TABS.DASHBOARD);
            }
        } catch (error) {
            Alert.alert("Registration Error", (error as Error).message);
        }
    }

    function handleLogin() {
        router.replace(ROUTES.AUTH.LOGIN);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
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

                    <Text style={style.title}>{t("auth.register.title")}</Text>

                    <TextField
                        label={t("auth.register.name")}
                        icon={ICONS.NAME}
                        placeholder={t("auth.register.namePlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setName}
                    />

                    <TextField
                        label={t("auth.register.email")}
                        icon={ICONS.EMAIL}
                        placeholder={t("auth.register.emailPlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setEmail}
                    />

                    <PasswordTextField
                        label={t("auth.register.password")}
                        hideText={t("auth.register.buttonHide")}
                        showText={t("auth.register.buttonShow")}
                        icon={ICONS.PASSWORD}
                        placeholder={t("auth.register.passwordPlaceholder")}
                        onChangeText={setPassword}
                    />

                    <TextField
                        label={t("auth.register.deviceId")}
                        icon={ICONS.DEVICE}
                        placeholder={t("auth.register.deviceIdPlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setmcuCode}
                    />

                    <Text style={style.text}>
                        {t("auth.register.haveAccount")}
                        <Text style={style.link} onPress={handleLogin}>
                            {t("auth.register.loginLink")}
                        </Text>
                    </Text>

                    <FlexButton
                        title={t("auth.register.button")}
                        onPress={handleRegister}
                    />
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
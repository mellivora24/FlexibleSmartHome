import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, KeyboardAvoidingView, ScrollView, Text } from "react-native";

import { FlexButton } from "@components/FlexButton";
import { TextField } from "@components/TextField";
import { ICONS, IMAGES } from "@constants/images";
import "@i18n";
import { BACKGROUND } from "@theme/colors";
import { style } from "./style/auth";

export default function OnboardScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [deviceId, setDeviceID] = useState("");
    const [devicePin, setDevicePin] = useState("");


    function handleDone() {
        console.log("Assign with", deviceId, devicePin);
        // TODO: Implement onboarding logic here
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

                    <Text style={[style.text, {fontSize: 18}]}>{t("auth.onboarding.title")}</Text>

                    <TextField
                        label={t("auth.onboarding.deviceId")}
                        icon={ICONS.DEVICE}
                        placeholder={t("auth.onboarding.deviceIdPlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setDeviceID}
                    />

                    <TextField
                        label={t("auth.onboarding.devicePin")}
                        icon={ICONS.PIN}
                        placeholder={t("auth.onboarding.devicePinPlaceholder")}
                        secureTextEntry={false}
                        onChangeText={setDevicePin}
                    />

                    <Text/>

                    <FlexButton
                        title={t("auth.onboarding.button")}
                        onPress={handleDone}
                    />

                    <Text style={style.tip}>
                        {t("auth.onboarding.tip")}
                    </Text>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
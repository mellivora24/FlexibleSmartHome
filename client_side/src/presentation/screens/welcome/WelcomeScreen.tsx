import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity } from "react-native";

import { IMAGES } from "@constants/images";
import { ROUTES } from "@constants/routes";
import "@i18n";
import { BACKGROUND } from "@theme/colors";
import { style } from "./style/welcome";

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    function handleGetStarted() {
        router.replace(ROUTES.AUTH.LOGIN);
    }

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={style.container}
        >
            <Image source={IMAGES.LOGO_ROUNDED} style={{ width: 200, height: 200 }} resizeMode="contain" />
            <Text style={style.subtitle}>{t("welcome.subtitle")}</Text>

            <TouchableOpacity style={style.button} onPress={handleGetStarted}>
                <Text style={style.buttonText}>{t("welcome.getStarted")}</Text>
            </TouchableOpacity>
            
        </LinearGradient>
    );
}

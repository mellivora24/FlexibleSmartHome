import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text } from "react-native";

import { FlexButton } from "@components/FlexButton";
import { IMAGES } from "@constants/images";
import { ROUTES } from "@constants/routes";
import { useAuthToken } from "@src/presentation/hooks/useAppContext";
import { verifyToken } from "@src/presentation/hooks/useAuthViewModel";
import { BACKGROUND } from "@theme/colors";
import { style } from "./style/welcome";

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const token = useAuthToken();

    useEffect(() => {
        if (token) {
            try {
                verifyToken(token).then(() => {
                    router.replace(ROUTES.TABS.DASHBOARD);
                }).catch(() => {
                    router.replace(ROUTES.AUTH.LOGIN);
                });
            } catch (error) {
                console.error("Token verification failed:", error);
                router.replace(ROUTES.AUTH.LOGIN);
            }
        }
    }, [token]);

    function handleGetStarted() {
        router.replace(ROUTES.AUTH.LOGIN);
    }

    if (token) {
        return null;
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
            <FlexButton title={t("welcome.getStarted")} onPress={handleGetStarted} />
        </LinearGradient>
    );
}

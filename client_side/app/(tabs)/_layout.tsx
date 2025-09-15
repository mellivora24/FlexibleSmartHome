import { Stack } from "expo-router";
import React from "react";

import { COLORS } from "@theme/colors";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.DARK }, animation: 'none' }}>
            <Stack.Screen name="dashboard" />
        </Stack>
    );
}

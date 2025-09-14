import { Stack } from "expo-router";

import { COLORS } from "@theme/colors";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.DARK }, animation: 'none' }} />
    );
}

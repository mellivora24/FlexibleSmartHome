import "@i18n";

import { Stack } from "expo-router";

import { NotificationProvider } from "@src/presentation/hooks/NotificationContext";
import { AuthProvider } from "@src/presentation/hooks/useAppContext";
import { COLORS } from "@theme/colors";

export default function Layout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.DARK }, animation: "none" }} />
      </NotificationProvider>
    </AuthProvider>
  );
}

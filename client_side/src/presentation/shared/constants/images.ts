import { ImageSourcePropType } from "react-native";

export const IMAGES: Record<string, ImageSourcePropType> = {
  LOGO: require("@assets/images/circle_logo.png"),
  LOGO_NO_BG: require("@assets/images/no_background_logo.png"),
  LOGO_ROUNDED: require("@assets/images/rounder_logo.png"),
  AVATAR_PLACEHOLDER: require("@assets/images/avatar_placeholder.png"),
  PUB_LIGHT_ON: require("@assets/images/pub_light_on.png"),
  PUB_LIGHT_OFF: require("@assets/images/pub_light_off.png"),
};

export const ICONS: Record<string, ImageSourcePropType> = {
  EMAIL: require("@assets/icons/register_email_icon.png"),
  NAME: require("@assets/icons/register_name_icon.png"),
  PASSWORD: require("@assets/icons/register_password_icon.png"),
  DEVICE: require("@assets/icons/onboarding_device_icon.png"),
  PIN: require("@assets/icons/onboarding_pin_icon.png"),
  RECORD: require("@assets/icons/navbar_record_icon.png"),
  STOP_RECORD: require("@assets/icons/navbar_stop_record_icon.png"),
  NOTIFICATION_0: require("@assets/icons/topbar_notification_0_icon.png"),
  NOTIFICATION_1: require("@assets/icons/topbar_notification_1_icon.png"),
  DASHBOARD_LOCATION: require("@assets/icons/dashboard_location_icon.png"),
  DASHBOARD_CLOUDY: require("@assets/icons/dashboard_cloudy_icon.png"),
  DASHBOARD_RAINY: require("@assets/icons/dashboard_rainny_icon.png"),
  DASHBOARD_SUNNY: require("@assets/icons/dashboard_sunny_icon.png"),
  CARD_TAP: require("@assets/icons/dashboard_tap_icon.png"),
};

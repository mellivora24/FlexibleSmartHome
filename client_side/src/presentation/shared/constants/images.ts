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
  SEARCH_ICON: require("@assets/icons/components_search_icon.png"),
  FILTER_ICON: require("@assets/icons/components_filter_icon.png"),
  FILE_ICON: require("@assets/icons/file_icon.png"),
  LINK_ICON: require("@assets/icons/link_icon.png"),
};

export const TAB_ICON = {
  DASHBOARD_ACTIVE: require("@assets/icons/navbar_dashboard_active_icon.png"),
  DASHBOARD_INACTIVE: require("@assets/icons/navbar_dashboard_inactive_icon.png"),
  SENSOR_ACTIVE: require("@assets/icons/navbar_sensor_active_icon.png"),
  SENSOR_INACTIVE: require("@assets/icons/navbar_sensor_inactive_icon.png"),
  DEVICE_ACTIVE: require("@assets/icons/navbar_device_active_icon.png"),
  DEVICE_INACTIVE: require("@assets/icons/navbar_device_inactive_icon.png"),
  EVENT_ACTIVE: require("@assets/icons/navbar_event_active_icon.png"),
  EVENT_INACTIVE: require("@assets/icons/navbar_event_inactive_icon.png"),
  ACCOUNT_ACTIVE: require("@assets/icons/navbar_account_active_icon.png"),
  ACCOUNT_INACTIVE: require("@assets/icons/navbar_account_inactive_icon.png"),
}

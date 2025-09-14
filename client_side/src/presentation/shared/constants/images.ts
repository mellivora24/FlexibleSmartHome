import { ImageSourcePropType } from "react-native";

export const IMAGES: Record<string, ImageSourcePropType> = {
  LOGO: require("@assets/images/circle_logo.png"),
  LOGO_NO_BG: require("@assets/images/no_background_logo.png"),
  LOGO_ROUNDED: require("@assets/images/rounder_logo.png"),
};


export const ICONS: Record<string, ImageSourcePropType> = {
  EMAIL: require("@assets/icons/register_email_icon.png"),
  NAME: require("@assets/icons/register_name_icon.png"),
  PASSWORD: require("@assets/icons/register_password_icon.png"),
  DEVICE: require("@assets/icons/onboarding_device_icon.png"),
  PIN: require("@assets/icons/onboarding_pin_icon.png"),
};

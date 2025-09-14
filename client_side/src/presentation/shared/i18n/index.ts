import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const deviceLanguage = Localization.getLocales()[0].languageCode || "en";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: deviceLanguage,
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
    resources: {
        en: { translation: require("./locales/en.json") },
        vi: { translation: require("./locales/vi.json") },
    }
  });

export default i18n;

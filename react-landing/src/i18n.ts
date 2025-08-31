import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { welcome: "Welcome to my portfolio", description: "This is a demo React landing page" } },
      ru: { translation: { welcome: "Добро пожаловать в моё портфолио", description: "Это демонстрационный React лендинг" } },
      ua: { translation: { welcome: "Ласкаво просимо до мого портфоліо", description: "Це демонстраційний React лендинг" } }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;

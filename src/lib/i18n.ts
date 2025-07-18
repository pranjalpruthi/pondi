import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import translationEN from '../locales/en.json';
import translationTA from '../locales/ta.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ta: {
    translation: translationTA,
  },
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'ta'],
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
      lookupQuerystring: 'lang',
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;

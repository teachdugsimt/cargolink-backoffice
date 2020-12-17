import i18next from 'i18next';

i18next.init({
  fallbackLng: 'th',
  resources: {
    th: {
      translations: require('../locales/th/translations.json'),
    },
    en: {
      translations: require('../locales/en/translations.json'),
    },
  },
  ns: ['translations'],
  defaultNS: 'translations',
  returnObjects: true,
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  react: {
    wait: true,
  },
});

i18next.languages = ['th', 'en'];

export default i18next;

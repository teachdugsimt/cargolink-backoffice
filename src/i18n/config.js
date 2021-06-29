import i18next from 'i18next';

i18next.init({
  fallbackLng: 'th',
  resources: {
    th: {
      translations: require('../locales/th/translations.json'),
      resetPassword: require('../locales/th/resetPassword.json'),
      changePassword: require('../locales/th/changePassword.json'),
      docStatus: require('../locales/th/documentStatus.json'),
      userStatus: require('../locales/th/userStatus.json'),
    },
    en: {
      translations: require('../locales/en/translations.json'),
      resetPassword: require('../locales/en/resetPassword.json'),
      changePassword: require('../locales/en/changePassword.json'),
      docStatus: require('../locales/en/documentStatus.json'),
      userStatus: require('../locales/en/userStatus.json'),
    },
  },
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

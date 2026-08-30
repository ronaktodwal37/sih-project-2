import en from './en.js';

const translations = { en };

let currentLang = 'en';

export const t = (key) => {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
};

export const setLanguage = (lang) => {
  if (translations[lang]) currentLang = lang;
};

export const getLanguage = () => currentLang;

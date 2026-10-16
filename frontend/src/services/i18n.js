import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en/translation.json'
import ru from '../locales/ru/translation.json'
import uz from '../locales/uz/translation.json'

const saved = localStorage.getItem('language')

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: ['uz', 'en', 'ru'].includes(saved) ? saved : 'uz',
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
})

// keep <html lang="..."> in sync with the selected language
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lang) => {
  document.documentElement.lang = lang
  localStorage.setItem('language', lang)
})

export default i18n

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import commonEN from './translations/en/common.json'
import commonCN from './translations/cn/common.json'
import commonAE from './translations/ae/common.json'
import commonDE from './translations/de/common.json'
import commonES from './translations/es/common.json'
import commonFR from './translations/fr/common.json'
import commonID from './translations/id/common.json'
import commonKR from './translations/kr/common.json'
import commonPT from './translations/pt/common.json'
import commonSE from './translations/se/common.json'
import commonTH from './translations/th/common.json'


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: commonEN
      },
      cn: {
        translations: commonCN
      },
      ae: {
        translations: commonAE
      },
      de: {
        translations: commonDE
      },
      es: {
        translations: commonES
      },
      fr: {
        translations: commonFR
      },
      id: {
        translations: commonID
      },
      kr: {
        translations: commonKR
      },
      pt: {
        translations: commonPT
      },
      se: {
        translations: commonSE
      },
      th: {
        translations: commonTH
      }
    },
    fallbackLng: 'en',
    // debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n

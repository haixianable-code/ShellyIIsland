
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.ts';
import zhTranslation from './locales/zh.ts';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation }
    },
    // 1. 如果检测到的语言没有翻译（比如德语），回退到英文
    fallbackLng: 'en',
    
    // 2. 关键：将 zh-CN, zh-TW, zh-HK 统一归类为 'zh'，这样中文系统用户就能看到中文
    load: 'languageOnly',
    
    // 3. 支持的语言列表
    supportedLngs: ['en', 'zh'],
    
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      // 4. 检测顺序：
      // - localStorage: 记住用户上次手动切换的语言
      // - navigator: 检测浏览器/系统语言
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // 缓存用户选择到 localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;

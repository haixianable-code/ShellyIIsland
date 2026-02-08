
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
    // 默认回退语言为英文 (非中文系统都会显示英文)
    fallbackLng: 'en',
    
    // 关键配置：只加载语言代码 (例如 zh-CN -> zh)，确保所有中文变体都能匹配到 zh 资源
    load: 'languageOnly',
    
    // 明确支持的语言列表
    supportedLngs: ['en', 'zh'],
    
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      // 检测顺序：先看本地缓存(用户上次的选择)，如果没有则看浏览器系统设置
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;

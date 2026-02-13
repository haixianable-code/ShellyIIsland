
import React from 'react';
import { useTranslation } from 'react-i18next';

interface BilingualProps {
  en: React.ReactNode;
  zh: React.ReactNode;
}

export const Bi: React.FC<BilingualProps> = ({ en, zh }) => {
  const { i18n } = useTranslation();
  // Detect if the language is Chinese (covers zh, zh-CN, zh-TW, etc.)
  const isChinese = i18n.language?.startsWith('zh');

  return <>{isChinese ? zh : en}</>;
};

export const getBilingualText = (
  content: string | { en: string; zh: string }, 
  currentLang: string
): string => {
  if (typeof content === 'string') return content;
  return currentLang.startsWith('zh') ? content.zh : content.en;
};

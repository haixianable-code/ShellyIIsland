
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { playClick } from '../utils/sfx';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    playClick();
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#e0d9b4] bg-white text-[#4b7d78] font-black text-xs hover:bg-[#f1f8e9] transition-all bubble-button shadow-sm"
    >
      <Languages size={14} className="text-[#8bc34a]" />
      <span className="tracking-tighter">
        {i18n.language.startsWith('zh') ? 'English / 中文' : '中文 / English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

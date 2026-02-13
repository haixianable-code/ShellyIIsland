import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  type?: 'website' | 'article';
  image?: string;
  jsonLd?: any;
  breadcrumbs?: BreadcrumbItem[];
  themeColor?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  url, 
  type = 'website', 
  image = 'https://ssisland.space/og-preview.png',
  jsonLd,
  breadcrumbs,
  themeColor = '#78c850'
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // 1. Update Title & HTML Lang
    document.title = `${title} | Shelly Spanish Island`;
    const robotLang = i18n.language.startsWith('zh') ? 'zh-Hans' : 'en';
    document.documentElement.lang = robotLang;

    // 2. Update Meta Tags
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords.join(', '));
    updateMeta('theme-color', themeColor);
    
    // OG Tags
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:image', image, 'property');

    // Twitter Tags
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // 3. Handle Canonical and Hreflang
    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname.replace(/\/$/, ""); 
    const currentHash = window.location.hash;
    const fullNormalizedUrl = `${currentOrigin}${currentPath}${currentHash}`;

    const updateLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]` 
        : `link[rel="${rel}"]:not([hreflang])`;
      
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    updateLink('canonical', fullNormalizedUrl);
    updateLink('alternate', fullNormalizedUrl, 'x-default');
    updateLink('alternate', fullNormalizedUrl, 'en');
    updateLink('alternate', fullNormalizedUrl, 'zh-Hans');

    // 4. Inject Combined JSON-LD Schemas
    const scriptId = 'ssi-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (script) script.remove();

    const schemas: any[] = [];
    
    // Add custom page schemas (like BlogPosting or WebApplication)
    if (jsonLd) {
      if (Array.isArray(jsonLd)) schemas.push(...jsonLd);
      else schemas.push(jsonLd);
    }

    // Automatically generate BreadcrumbList schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.item.startsWith('http') ? crumb.item : `${currentOrigin}${currentPath}${crumb.item}`
        }))
      });
    }

    if (schemas.length > 0) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemas);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, url, type, image, jsonLd, breadcrumbs, themeColor, i18n.language]);

  return null;
};

export default SEO;
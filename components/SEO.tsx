import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  type?: 'website' | 'article';
  image?: string;
  jsonLd?: any;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  url, 
  type = 'website', 
  image = 'https://ssisland.space/og-preview.png',
  jsonLd
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Shelly Spanish Island`;

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

    // 3. Inject JSON-LD
    const scriptId = 'ssi-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (script) script.remove();

    if (jsonLd) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      // Optional: Reset to defaults on unmount
    };
  }, [title, description, keywords, url, type, image, jsonLd]);

  return null; // Side-effect component
};

export default SEO;

import { useEffect } from 'react';
import './google-translate.css';
import { useLocation } from '@tanstack/react-router';

const GoogleTranslate = () => {
  const location = useLocation();

  useEffect(() => {
    const scriptId = 'google-translate-script';
    let intervalId: number | null = null;

    const setLanguage = () => {
      const params = new URLSearchParams(location.search);
      const lang = params.get('lang') || 'en';
      const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
      if (select) {
        if (select.value !== lang) {
          select.value = lang;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    const googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ta,af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh-CN,zh-TW,co,hr,cs,da,nl,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,rw,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,te,th,tr,tk,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
      setLanguage();
    };

    window.googleTranslateElementInit = googleTranslateElementInit;

    if (!document.getElementById(scriptId)) {
      const addScript = document.createElement('script');
      addScript.id = scriptId;
      addScript.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      addScript.async = true;
      document.body.appendChild(addScript);
    } else {
      googleTranslateElementInit();
    }

    intervalId = setInterval(setLanguage, 200);

    return () => {
      delete window.googleTranslateElementInit;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [location.search]);

  return <div id="google_translate_element" className="fixed bottom-4 right-4 z-50 hidden"></div>;
};

export default GoogleTranslate;

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages?: string;
              layout?: number;
              autoDisplay?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}
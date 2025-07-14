import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouterState } from '@tanstack/react-router';

const META_PIXEL_ID = '1263798527926051';
const GTM_ID = 'GTM-WRD25CNQ';

// Helper to track page views
const trackPageView = (url: string) => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      page: url,
    });
  }
};

export function Analytics() {
  const { location } = useRouterState();

  useEffect(() => {
    // Track page views on route changes
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <Helmet>
      {/* Meta Pixel Code */}
      <script id="meta-pixel-script">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </script>
      <noscript>
        {`
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"
          />
        `}
      </noscript>
      {/* End Meta Pixel Code */}

      {/* Google Tag Manager */}
      <script id="gtm-script">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </script>
      {/* End Google Tag Manager */}

      {/* Google Tag Manager (noscript) - Injected into <body> via Helmet */}
      <body {...{
        'data-gtm-noscript': `
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        `
      }} />

      {/* Umami Analytics */}
      <script
        defer
        src="https://find.vrindavanam.org.in/script.js"
        data-website-id="0dcacdb8-08a4-4b62-9fe1-0f97312a84d4"
      ></script>
      {/* End Umami Analytics */}
    </Helmet>
  );
}

// Extend the Window interface
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
    umami?: {
      track: (event_name: string, event_data?: any) => void;
    };
  }
}

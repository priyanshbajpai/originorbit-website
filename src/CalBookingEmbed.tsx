import { useEffect } from 'react';

type CalFunction = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalFunction>;
  q?: unknown[][];
  config?: { forwardQueryParams?: boolean };
};

const CAL_NAMESPACE = '30min';
const CAL_LINK = 'priyansh-bajpai-uf2nda/30min';

export default function CalBookingEmbed() {
  useEffect(() => {
    const calWindow = window as Window & { Cal?: CalFunction };
    const queue = (api: CalFunction, args: unknown[]) => {
      api.q ??= [];
      api.q.push(args);
    };

    if (!calWindow.Cal) {
      calWindow.Cal = ((...args: unknown[]) => {
        const cal = calWindow.Cal!;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = [];
          const script = document.createElement('script');
          script.src = 'https://app.cal.com/embed/embed.js';
          script.async = true;
          document.head.appendChild(script);
          cal.loaded = true;
        }
        if (args[0] === 'init') {
          const namespace = args[1];
          const api = ((...namespaceArgs: unknown[]) => queue(api, namespaceArgs)) as CalFunction;
          if (typeof namespace === 'string') {
            cal.ns![namespace] ??= api;
            queue(cal.ns![namespace], args);
            queue(cal, ['initNamespace', namespace]);
          } else queue(cal, args);
          return;
        }
        queue(cal, args);
      }) as CalFunction;
    }

    const cal = calWindow.Cal;
    cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' });
    cal.config ??= {};
    cal.config.forwardQueryParams = true;
    cal.ns?.[CAL_NAMESPACE]?.('inline', {
      elementOrSelector: '#my-cal-inline-30min',
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'auto' },
      calLink: CAL_LINK,
    });
    cal.ns?.[CAL_NAMESPACE]?.('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#07080B' }, dark: { 'cal-brand': '#F2EDE8' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, []);

  return <div id="my-cal-inline-30min" className="cal-inline" aria-label="Book a free 30-minute call with Priyansh" />;
}

import { type PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="color-scheme" content="light dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --daybreak-system-theme: light;
                --daybreak-bg: #fafbfd;
                --daybreak-bg-soft: #f3f6fb;
              }
              html, body, #root {
                height: 100%;
                min-height: 100%;
                background-color: var(--daybreak-bg-soft);
              }
              #root > div,
              #root > div > div,
              #root > div > div > div {
                background-color: var(--daybreak-bg-soft) !important;
              }
              body {
                overscroll-behavior-y: none;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof window === 'undefined') return;
                var media = typeof window.matchMedia === 'function'
                  ? window.matchMedia('(prefers-color-scheme: dark)')
                  : null;
                var apply = function () {
                  var mode = media && media.matches ? 'dark' : 'light';
                  window.__DAYBREAK_THEME__ = mode;
                };
                apply();
                if (media) {
                  if (typeof media.addEventListener === 'function') {
                    media.addEventListener('change', apply);
                  } else if (typeof media.addListener === 'function') {
                    media.addListener(apply);
                  }
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

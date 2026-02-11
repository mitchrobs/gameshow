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
              body {
                overscroll-behavior-y: none;
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --daybreak-system-theme: dark;
                  --daybreak-bg: #0b0f15;
                  --daybreak-bg-soft: #0f141d;
                }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof window === 'undefined') return;
                var root = document.documentElement;
                var media = typeof window.matchMedia === 'function'
                  ? window.matchMedia('(prefers-color-scheme: dark)')
                  : null;
                var apply = function () {
                  var mode = media && media.matches ? 'dark' : 'light';
                  var bg = mode === 'dark' ? '#0f141d' : '#f3f6fb';
                  window.__DAYBREAK_THEME__ = mode;
                  if (root) {
                    root.dataset.daybreakTheme = mode;
                    root.style.colorScheme = mode;
                    root.style.backgroundColor = bg;
                  }
                  if (document.body) {
                    document.body.style.backgroundColor = bg;
                  }
                  var appRoot = document.getElementById('root');
                  if (appRoot) {
                    appRoot.style.backgroundColor = bg;
                  }
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
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

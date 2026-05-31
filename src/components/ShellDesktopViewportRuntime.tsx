import { useEffect } from 'react';

/**
 * CLOSEFLOW_STAGE148_SCALED_DESKTOP_SHELL_RUNTIME
 *
 * Why this exists:
 * Some Chrome/Windows configurations can report a very small CSS viewport
 * (for example innerWidth around 326) even while the user is on a laptop-sized
 * window. Pure CSS media queries then choose a narrow/mobile layout and the
 * operator work surface is clipped.
 *
 * This runtime only activates for desktop-like input:
 * - hover + fine pointer,
 * - wide browser chrome/outer window,
 * - small CSS viewport.
 *
 * It creates a stable desktop design canvas and scales it back into the
 * reported CSS viewport. In practice this compensates the browser zoom/device
 * anomaly without breaking normal desktop or mobile.
 */
export function ShellDesktopViewportRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const apply = () => {
      if (frame) window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const innerWidth = Math.max(1, Math.round(window.innerWidth || 0));
        const outerWidth = Math.max(innerWidth, Math.round(window.outerWidth || innerWidth));
        const dpr = Math.max(1, Number(window.devicePixelRatio || 1));

        // Desktop-like window, but tiny CSS viewport. This is the current bug class.
        const shouldScale = hoverFine && outerWidth >= 1000 && innerWidth > 0 && innerWidth < 900;

        if (!shouldScale) {
          root.removeAttribute('data-cf148-scaled-desktop-shell');
          root.style.removeProperty('--cf148-design-width');
          root.style.removeProperty('--cf148-scale');
          root.style.removeProperty('--cf148-inverse-scale');
          root.style.removeProperty('--cf148-viewport-width');
          root.style.removeProperty('--cf148-outer-width');
          root.style.removeProperty('--cf148-device-pixel-ratio');
          return;
        }

        // Keep a real desktop operator canvas. 1280 is the minimum sane admin
        // shell width; wider browser shells can use a bit more.
        const suggestedFromOuter = Math.round(outerWidth / dpr);
        const designWidth = Math.min(1480, Math.max(1280, suggestedFromOuter));
        const scale = Math.max(0.2, Math.min(1, innerWidth / designWidth));
        const inverseScale = 1 / scale;

        root.setAttribute('data-cf148-scaled-desktop-shell', 'true');
        root.style.setProperty('--cf148-design-width', `${designWidth}px`);
        root.style.setProperty('--cf148-scale', String(scale));
        root.style.setProperty('--cf148-inverse-scale', String(inverseScale));
        root.style.setProperty('--cf148-viewport-width', `${innerWidth}px`);
        root.style.setProperty('--cf148-outer-width', `${outerWidth}px`);
        root.style.setProperty('--cf148-device-pixel-ratio', String(dpr));
      });
    };

    apply();

    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    const hoverFineQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    hoverFineQuery.addEventListener?.('change', apply);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      hoverFineQuery.removeEventListener?.('change', apply);
      root.removeAttribute('data-cf148-scaled-desktop-shell');
      root.style.removeProperty('--cf148-design-width');
      root.style.removeProperty('--cf148-scale');
      root.style.removeProperty('--cf148-inverse-scale');
      root.style.removeProperty('--cf148-viewport-width');
      root.style.removeProperty('--cf148-outer-width');
      root.style.removeProperty('--cf148-device-pixel-ratio');
    };
  }, []);

  return null;
}

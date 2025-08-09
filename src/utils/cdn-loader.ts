// src/utils/cdn-loader.ts

const HIGHCHARTS_CDN_URL = 'https://code.highcharts.com/highcharts.js';
let highchartsPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Highcharts library from a CDN if it's not already available.
 * @returns A promise that resolves when Highcharts is loaded.
 */
export function loadHighcharts(): Promise<void> {
  if (window.Highcharts) {
    return Promise.resolve();
  }

  if (highchartsPromise) {
    return highchartsPromise;
  }

  highchartsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = HIGHCHARTS_CDN_URL;
    script.async = true;

    script.onload = () => {
      if (window.Highcharts) {
        resolve();
      } else {
        reject(new Error('Highcharts failed to load from CDN.'));
      }
    };
    script.onerror = reject;

    document.head.appendChild(script);
  });

  return highchartsPromise;
}

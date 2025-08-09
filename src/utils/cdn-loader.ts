// src/utils/cdn-loader.ts

const HIGHCHARTS_CDN_URL = 'https://code.highcharts.com/highcharts.js';
let highchartsPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Highcharts library from a CDN if it's not already available.
 * @returns A promise that resolves when Highcharts is loaded.
 */
export function loadHighcharts(): Promise<void> {
  // If Highcharts is already available, resolve immediately.
  if (window.Highcharts) {
    return Promise.resolve();
  }

  // If the script is already being loaded, return the existing promise.
  if (highchartsPromise) {
    return highchartsPromise;
  }

  // Create a new promise to handle the script loading.
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
      highchartsPromise = null; // Reset for potential future reloads
    };

    script.onerror = (error) => {
      console.error('Error loading Highcharts from CDN:', error);
      reject(error);
      highchartsPromise = null; // Reset on error
    };

    document.head.appendChild(script);
  });

  return highchartsPromise;
}

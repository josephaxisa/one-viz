const HIGHCHARTS_BASE_URL = 'https://code.highcharts.com/';
const highchartsModules: { [key: string]: Promise<void> } = {};

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

async function loadHighchartsCore(): Promise<void> {
  if (window.Highcharts) {
    return;
  }
  if (!highchartsModules.core) {
    highchartsModules.core = loadScript(`${HIGHCHARTS_BASE_URL}highcharts.js`);
  }
  await highchartsModules.core;
}

export async function loadHighchartsModule(moduleName: string): Promise<void> {
  await loadHighchartsCore();
  if (!highchartsModules[moduleName]) {
    highchartsModules[moduleName] = loadScript(`${HIGHCHARTS_BASE_URL}modules/${moduleName}.js`);
  }
  await highchartsModules[moduleName];
}

/**
 * Dynamically loads the Highcharts library from a CDN if it's not already available.
 * @returns A promise that resolves when Highcharts is loaded.
 */
export async function loadHighcharts(): Promise<void> {
  await loadHighchartsCore();
}

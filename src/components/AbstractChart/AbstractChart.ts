import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type * as Highcharts from 'highcharts';
import { loadHighcharts } from '../../utils/cdn-loader';

export interface ChartData {
    [key: string]: string | number;
}

export abstract class AbstractChart extends LitElement {

    @property({ type: String, attribute: 'data-url' }) dataUrl: string = '';
    @property({ type: String, attribute: 'x-field' }) xField: string = '';
    @property({ type: String, attribute: 'y-field' }) yField: string = '';
    @property({ type: String }) title: string = '';
    @property({ type: Array, attribute: false }) data: ChartData[] = [];

    @state()
    protected errorMessage: string | null = null;

    protected chart: Highcharts.Chart | undefined;
    private highchartsLoaded: Promise<void>;

    constructor() {
        super();
        this.highchartsLoaded = loadHighcharts();
    }

    static styles = css`
     :host {
      display: block;
      width: 100%;
      height: 400px;
      font-family: sans-serif;
      position: relative; /* For centering the error message */
    }
    #chart {
      width: 100%;
      height: 100%;
    }
    .chart-title {
      text-align: center;
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 0.5em;
    }
    .error-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255,255, 0.9);
        padding: 1em;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        color: #721c24;
        text-align: center;
        max-width: 80%;
    }
    `;

    async firstUpdated() {
        try {
            await this.highchartsLoaded;
            if (this.dataUrl) {
                await this.fetchData();
            }
        } catch (error) {
            this.errorMessage = "Error: Could not load Highcharts library from CDN.";
            console.error(error);
        }
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        this.highchartsLoaded.then(() => {
            if (this.validateData()) {
                const options = this.getChartOptions();
                if (options) {
                    if (this.chart) {
                        this.chart.destroy();
                    }
                    const chartContainer = this.shadowRoot!.getElementById('chart');
                    if (chartContainer) {
                        this.chart = window.Highcharts.chart(chartContainer, options);
                    }
                }
            } else {
                if (this.chart) {
                    this.chart.destroy();
                    this.chart = undefined;
                }
            }
        }).catch(error => {
            this.errorMessage = "Error: Could not load Highcharts library from CDN.";
            console.error(error);
        });
    }

    async fetchData() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            this.errorMessage = "Error: Failed to fetch or parse data from URL.";
            console.error(error);
            this.data = [];
        }
    }

    protected validateData(): boolean {
        this.errorMessage = null; 

        if (!this.data) {
            this.errorMessage = "Error: Data has not been provided.";
            return false;
        }
        if (!Array.isArray(this.data)) {
            this.errorMessage = "Error: The provided data is not an array.";
            return false;
        }
        if (!this.xField || !this.yField) {
            this.errorMessage = "Error: 'x-field' and 'y-field' attributes are required.";
            return false;
        }

        if (this.data.length > 0) {
            const firstItem = this.data[0];
            if (!(this.xField in firstItem)) {
                this.errorMessage = `Error: The specified x-field "${this.xField}" does not exist in the data.`;
                return false;
            }
            if (!(this.yField in firstItem)) {
                this.errorMessage = `Error: The specified y-field "${this.yField}" does not exist in the data.`;
                return false;
            }
        }

        return true;
    }
    
    abstract getChartOptions(): Highcharts.Options | null;

    render() {
        return html`
      <div class="chart-title">${this.title}</div>
      <div id="chart">
        ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : ''}
      </div>
    `;
    }

     disconnectedCallback(): void {
         super.disconnectedCallback();
         if (this.chart) {
             this.chart.destroy();
             this.chart = undefined;
         }
     }
}

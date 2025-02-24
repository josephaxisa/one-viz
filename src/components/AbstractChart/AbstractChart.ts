import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';

export interface ChartData {
    [key: string]: string | number;
}

export abstract class AbstractChart extends LitElement {

    @property({ type: String, attribute: 'data-url' }) dataUrl: string = '';
    @property({ type: String, attribute: 'x-field' }) xField: string = '';
    @property({ type: String, attribute: 'y-field' }) yField: string = '';
    @property({ type: String }) title: string = '';
    @property({ type: Array, attribute: false }) data: ChartData[] = [];

    protected chart: Highcharts.Chart | undefined;

    static styles = css`
     :host {
      display: block;
      width: 100%;
      height: 400px;
      font-family: sans-serif;
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
    `;

    async firstUpdated() {
        if (this.dataUrl) {
            await this.fetchData();
        }
        this.createChart();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('data') || changedProperties.has('xField') || changedProperties.has('yField') || changedProperties.has('title')) {
            this.createChart();
        }
    }

    async fetchData() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            this.data = [];
        }
    }

    abstract createChart(): void;

    render() {
        return html`
      <div class="chart-title">${this.title}</div>
      <div id="chart"></div>
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
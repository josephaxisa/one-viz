import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { loadHighcharts } from '../../utils/cdn-loader';

export abstract class AbstractChart extends LitElement {
    @property({ type: String }) title = '';
    @property({ type: Array }) data = [];
    @property({ type: String, attribute: 'x-field' }) xField = '';
    @property({ type: String, attribute: 'y-field' }) yField = '';

    protected chart: any = null;
    private highchartsPromise: Promise<void>;

    constructor() {
        super();
        this.highchartsPromise = loadHighcharts();
    }

    static styles = css`
        :host { display: block; }
        .chart-title { text-align: center; font-size: 1.2em; font-weight: bold; margin-bottom: 1em; }
    `;

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('data')) {
            try {
                // Wait for Highcharts to be loaded before creating the chart.
                await this.highchartsPromise;
                this.createChart();
            } catch (error) {
                console.error("Highcharts failed to load", error);
            }
        }
    }

    createChart() {
        if (!this.data || this.data.length === 0) {
            return;
        }

        const container = this.shadowRoot?.querySelector('#chart-container');
        if (!container) {
            console.error('Chart container not found');
            return;
        }

        const options = this.getChartOptions();
        if (options) {
            this.chart = window.Highcharts.chart(container as HTMLElement, options);
        }
    }

    abstract getChartOptions(): Options | null;

    render() {
        return html`
            <div class="chart-title">${this.title}</div>
            <div id="chart-container" style="width: 100%; height: 400px;"></div>
        `;
    }
}

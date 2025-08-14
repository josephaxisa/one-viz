import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { loadHighcharts } from '../../utils/cdn-loader';
import { deepMerge } from '../../utils/deep-merge';

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
        :host {
            display: block;
            width: 100%;
            height: 100%;
            /* Default theme variables */
            --oneviz-background-color: #ffffff;
            --oneviz-title-color: #333333;
            --oneviz-axis-label-color: #666666;
            --oneviz-font-family: 'sans-serif';
        }
        .chart-title {
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 1em;
            color: var(--oneviz-title-color);
            font-family: var(--oneviz-font-family);
        }
        #chart-container {
            width: 100%;
            height: 400px;
        }
    `;

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('data') && this.data?.length > 0) {
            await this.highchartsPromise;
            this.createChart();
        }
    }

    private getThemedChartOptions(): Options {
        const styles = getComputedStyle(this);
        const backgroundColor = styles.getPropertyValue('--oneviz-background-color').trim();
        const titleColor = styles.getPropertyValue('--oneviz-title-color').trim();
        const axisLabelColor = styles.getPropertyValue('--oneviz-axis-label-color').trim();
        const fontFamily = styles.getPropertyValue('--oneviz-font-family').trim();

        return {
            chart: {
                backgroundColor: backgroundColor || undefined,
                style: { fontFamily: fontFamily || undefined }
            },
            title: { style: { color: titleColor || undefined } },
            xAxis: {
                labels: { style: { color: axisLabelColor || undefined } },
                title: { style: { color: axisLabelColor || undefined } }
            },
            yAxis: {
                labels: { style: { color: axisLabelColor || undefined } },
                title: { style: { color: axisLabelColor || undefined } }
            },
            legend: { itemStyle: { color: axisLabelColor || undefined } }
        };
    }

    public refreshChart() {
        this.createChart();
    }

    private createChart() {
        if (!this.data || this.data.length === 0 || !window.Highcharts) {
            return;
        }

        if (this.chart) {
            this.chart.destroy();
        }

        const container = this.shadowRoot?.querySelector('#chart-container');
        if (!container) {
            console.error('Chart container not found');
            return;
        }

        const specificOptions = this.getSpecificChartOptions();
        const themedOptions = this.getThemedChartOptions();
        const finalOptions = deepMerge(themedOptions, specificOptions);
        
        this.chart = window.Highcharts.chart(container as HTMLElement, finalOptions);
    }

    abstract getSpecificChartOptions(): Options | null;

    render() {
        return html`
            <div class="chart-title">${this.title}</div>
            <div id="chart-container" style="width: 100%; height: 400px;"></div>
        `;
    }
}
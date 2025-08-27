import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { loadHighcharts } from '../../utils/cdn-loader';
import { deepMerge } from '../../utils/deep-merge';

export abstract class AbstractChart extends LitElement {
    @property({ type: String }) title = '';
    @property({ type: Array }) data: any[] = [];
    @property({ type: String, attribute: 'x-field' }) xField = '';
    @property({ type: String, attribute: 'y-field' }) yField = '';

    protected chart: any = null;
    protected highchartsPromise: Promise<any>;
    private originalData: any[] = [];
    private currentFilter: { field: string, value: any } | null = null;

    constructor() {
        super();
        this.highchartsPromise = loadHighcharts();
        window.addEventListener('oneviz-filter-change', this.handleFilterChange.bind(this) as EventListener);
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
        window.removeEventListener('oneviz-filter-change', this.handleFilterChange.bind(this) as EventListener);
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('data')) {
            if (!this.originalData.length) {
                this.originalData = [...this.data];
            }
            await this.highchartsPromise;
            this.createChart();
        }
    }

    private handleFilterChange(event: CustomEvent) {
        const { field, value, source } = event.detail;

        // Ignore events from self
        if (source === this) {
            return;
        }

        // If the filter's field doesn't match the chart's xField, ignore it
        if (field !== this.xField) {
            return;
        }

        // If value is null, it's a signal to clear the filter
        if (value === null) {
            this.currentFilter = null;
            this.data = [...this.originalData];
        } else { // Otherwise, apply the new filter
            this.currentFilter = { field, value };
            this.data = this.originalData.filter(item => item[this.xField] === value);
        }
    }

    protected pointClickCallback(value: any) {
        const field = this.xField;

        // If the user clicks the currently active filter point, clear the filter
        if (this.currentFilter?.field === field && this.currentFilter?.value === value) {
            this.currentFilter = null;
            this.data = [...this.originalData];
            
            // Dispatch a global event to clear filters on other charts
            window.dispatchEvent(new CustomEvent('oneviz-filter-change', {
                detail: { field, value: null, source: this },
                bubbles: true,
                composed: true
            }));
        } else {
            // Apply the filter locally
            this.currentFilter = { field, value };
            this.data = this.originalData.filter(item => item[this.xField] === value);

            // Dispatch a global event to apply filters on other charts
            window.dispatchEvent(new CustomEvent('oneviz-filter-change', {
                detail: { field, value, source: this },
                bubbles: true,
                composed: true
            }));
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
        if (!this.data || !window.Highcharts) {
            // If data is empty, still render an empty chart for consistency
            if (this.chart) {
                this.chart.destroy();
            }
            const container = this.shadowRoot?.querySelector('#chart-container');
            if (container) {
                this.chart = window.Highcharts.chart(container as HTMLElement, this.getThemedChartOptions());
            }
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

    protected abstract getSpecificChartOptions(): Options;

    render() {
        return html`
            <div class="chart-title">${this.title}</div>
            <div id="chart-container" style="width: 100%; height: 400px;"></div>
        `;
    }
}

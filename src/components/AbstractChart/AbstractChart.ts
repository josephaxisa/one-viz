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
    `;

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('data')) {
            try {
                await this.highchartsPromise;
                this.createChart();
            } catch (error) {
                console.error("Highcharts failed to load", error);
            }
        }
    }

    private getThemedChartOptions(): Options {
        return {
            chart: {
                backgroundColor: 'var(--oneviz-background-color)',
                style: {
                    fontFamily: 'var(--oneviz-font-family)',
                }
            },
            title: {
                style: {
                    color: 'var(--oneviz-title-color)',
                }
            },
            xAxis: {
                labels: {
                    style: {
                        color: 'var(--oneviz-axis-label-color)',
                    }
                },
                title: {
                    style: {
                        color: 'var(--oneviz-axis-label-color)',
                    }
                }
            },
            yAxis: {
                labels: {
                    style: {
                        color: 'var(--oneviz-axis-label-color)',
                    }
                },
                title: {
                    style: {
                        color: 'var(--oneviz-axis-label-color)',
                    }
                }
            },
            legend: {
                itemStyle: {
                    color: 'var(--oneviz-axis-label-color)',
                }
            }
        };
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

        const specificOptions = this.getSpecificChartOptions();
        if (specificOptions) {
            const themedOptions = this.getThemedChartOptions();
            const finalOptions = deepMerge(themedOptions, specificOptions);
            this.chart = window.Highcharts.chart(container as HTMLElement, finalOptions);
        }
    }

    abstract getSpecificChartOptions(): Options | null;

    render() {
        return html`
            <div class="chart-title">${this.title}</div>
            <div id="chart-container" style="width: 100%; height: 400px;"></div>
        `;
    }
}

import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';

export class AbstractChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: var(--oneviz-chart-height, 400px); /* Default height */
      --oneviz-chart-background-color: #FFFFFF;
      --oneviz-chart-title-color: #333333;
      --oneviz-chart-title-font-size: 18px;
      --oneviz-chart-legend-text-color: #333333;
      --oneviz-chart-datalabel-color: #333333;
    }
    #chart {
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: Array }) data?: Record<string, any>[];
  @property({ type: String }) xField?: string;
  @property({ type: String }) yField?: string;
  @property({ type: String }) title: string = 'Chart'; // Default title
  @property({ type: Boolean }) showLegend?: boolean = true;


  protected chart?: Highcharts.Chart;

  // Method to be implemented by subclasses
  createChart(): void {
    throw new Error('createChart() must be implemented by subclasses.');
  }

  connectedCallback() {
    super.connectedCallback();
    // Ensure createChart is called when the component is connected and data might be ready
    // Might need a slight delay if data is passed asynchronously right after connection
    Promise.resolve().then(() => this.createChart());
  }

  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    super.disconnectedCallback();
  }

  render() {
    return html`<div id="chart"></div>`;
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('data') ||
        changedProperties.has('xField') ||
        changedProperties.has('yField') ||
        changedProperties.has('title') ||
        changedProperties.has('showLegend')
       ) {
      this.createChart();
    }
  }
}
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';

interface ChartData {
    [key: string]: string | number;
}

@customElement('oneviz-barchart')
export class OneVizBarChart extends LitElement {

    @property({ type: String, attribute: 'data-url' }) dataUrl: string = '';
    @property({ type: String, attribute: 'x-field' }) xField: string = '';
    @property({ type: String, attribute: 'y-field' }) yField: string = '';
    @property({ type: String }) title: string = 'OneViz Bar Chart';
    @property({ type: Array }) data: ChartData[] = [];


  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 400px;
      font-family: sans-serif; /* Add a default font */
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

  private chart: Highcharts.Chart | undefined;

  async firstUpdated() {
    if (this.dataUrl) {
      await this.fetchData();
    }
    this.createChart();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('data') || changedProperties.has('xField') || changedProperties.has('yField')) {
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
      this.data = []; // Set data to empty array on error
      // Consider rendering an error message in the UI
    }
  }

  createChart() {
    if (!this.data || this.data.length === 0 || !this.xField || !this.yField) {
      return;
    }

    const categories = this.data.map((item) => String(item[this.xField])); // Ensure categories are strings
    const seriesData = this.data.map((item) => Number(item[this.yField])); // Ensure values are numbers

    if (this.chart) {
        this.chart.destroy(); //destroy the previous chart instance
    }

    this.chart = Highcharts.chart(this.shadowRoot!.getElementById('chart')!, {
      chart: {
        type: 'bar'
      },
      title: {
        text: this.title
      },
      xAxis: {
        categories: categories,
        title: {
          text: this.xField
        }
      },
      yAxis: {
        title: {
          text: this.yField
        },
        min: 0, // Ensure y-axis starts at 0
      },
      series: [{
        type: 'bar',
        name: this.yField,
        data: seriesData,
        color: '#4CAF50' // Add a default color
      }],
        credits: {
            enabled: false
        },
    });
  }

  render() {
    return html`
      <div class="chart-title">${this.title}</div>
      <div id="chart"></div>
    `;
  }
}
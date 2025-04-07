import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';

@customElement('oneviz-barchart')
export class OneVizBarChart extends LitElement {

  @property({ type: String, attribute: 'data-url' }) dataUrl = '';
  @property({ type: String, attribute: 'x-field' }) xField = '';
  @property({ type: String, attribute: 'y-field' }) yField = '';
  @property({ type: String }) title = 'OneViz Bar Chart';
  @property({ type: Array }) data: Array<any> = [];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 400px; /* Or any default height */
    }
    #chart {
      width: 100%;
      height: 100%;
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
      this.data = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  createChart() {
    if (!this.data || this.data.length === 0 || !this.xField || !this.yField) {
      return; // Don't create a chart if data or fields are missing
    }

    const categories = this.data.map((item) => item[this.xField]);
    const seriesData = this.data.map((item) => item[this.yField]);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = Highcharts.chart(this.shadowRoot!.getElementById('chart')!, { // Ensure shadowRoot is not null
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
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.x}</b><br/>${this.series.name}: ${this.y}`; 
        }
      },
      series: [{
        type: 'bar',
        name: this.yField,
        data: seriesData
      }]
    });
  }

  render() {
    return html`<div id="chart"></div>`;
  }
}
import { LitElement, html, css, property } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';
import { ChartData } from '../../types'; // Assuming you have this type defined

@customElement('oneviz-piechart')
export class OneVizPieChart extends LitElement {
  @property({ type: Array }) data: ChartData=;
  @property({ type: String, attribute: 'data-field' }) dataField = 'value'; // Field containing the numerical value
  @property({ type: String, attribute: 'category-field' }) categoryField = 'category'; // Field containing the category name

  private chart?: Highcharts.Chart;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 400px; /* Or any default height */
    }
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `;

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('data') ||
      changedProperties.has('dataField') ||
      changedProperties.has('categoryField')
    ) {
      this.renderChart();
    }
  }

  renderChart() {
    if (!this.shadowRoot) {
      return;
    }

    const container = this.shadowRoot.querySelector('.chart-container');
    if (!container) {
      return;
    }

    const chartData = this.data.map((item) => ({
      name: item[this.categoryField],
      y: item[this.dataField],
    }));

    if (this.chart) {
      this.chart.destroy(); // Clean up previous chart instance
    }

    this.chart = Highcharts.chart(container as HTMLElement, {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Placeholder Pie Chart', // Add a title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Data',
          data: chartData,
        },
      ],
      credits: {
        enabled: false, // Disable Highcharts credits
      },
    });
  }

  render() {
    return html`<div class="chart-container"></div>`;
  }
}
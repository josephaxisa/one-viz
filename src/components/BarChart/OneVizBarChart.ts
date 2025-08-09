import { customElement } from 'lit/decorators.js';
import type * as Highcharts from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-barchart')
export class OneVizBarChart extends AbstractChart {
  
  createChart() {
    if (!this.data || this.data.length === 0 || !this.xField || !this.yField) {
      return; // Don't create a chart if data or fields are missing
    }

    const categories = this.data.map((item) => String(item[this.xField]));
    const seriesData = this.data.map((item) => item[this.yField]);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = window.Highcharts.chart(this.shadowRoot!.querySelector('#chart') as HTMLElement, {
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
}

import { customElement } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-barchart')
export class OneVizBarChart extends AbstractChart {
  
  getChartOptions(): Options | null {
    if (this.data.length === 0) {
        return null; // Don't render an empty chart
    }

    const categories = this.data.map((item) => String(item[this.xField]));
    const seriesData = this.data.map((item) => item[this.yField]);

    return {
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
    };
  }
}

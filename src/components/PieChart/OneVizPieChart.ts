import { customElement } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-piechart')
export class OneVizPieChart extends AbstractChart {
  
  getChartOptions(): Options | null {
    if (!this.data || this.data.length === 0) {
        return null;
    }

    const seriesData = this.data.map((item: any) => ({
        name: item[this.xField],
        y: item[this.yField]
    }));

    return {
      chart: {
        type: 'pie'
      },
      title: {
        text: '' // Title is handled by the component's template
      },
      series: [{
        type: 'pie',
        name: this.yField,
        data: seriesData
      }]
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'oneviz-piechart': OneVizPieChart;
  }
}

import { customElement, property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { loadHighchartsModule } from '../../utils/cdn-loader';

@customElement('oneviz-bubblechart')
export class OneVizBubbleChart extends AbstractChart {
  @property({ type: String, attribute: 'z-field' }) zField = '';

  constructor() {
    super();
    this.highchartsPromise = loadHighchartsModule('highcharts-more');
  }

  protected getSpecificChartOptions(): Options {
    const seriesData = this.data.map((item: any) => ({
      x: item[this.xField],
      y: item[this.yField],
      z: item[this.zField],
    }));

    return {
      chart: {
        type: 'bubble',
        zoomType: 'xy' as any,
      },
      title: {
        text: '', // Title is handled by the component's template
      },
      xAxis: {
        title: {
          text: this.xField,
        },
      },
      yAxis: {
        title: {
          text: this.yField,
        },
      },
      series: [
        {
          type: 'bubble',
          name: `${this.yField} vs ${this.xField} with size ${this.zField}`,
          data: seriesData,
        },
      ],
    };
  }
}

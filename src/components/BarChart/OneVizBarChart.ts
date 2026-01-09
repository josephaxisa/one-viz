import { customElement, property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { loadHighchartsModule } from '../../utils/cdn-loader';

@customElement('oneviz-barchart')
export class OneVizBarChart extends AbstractChart {
  @property({ type: Object }) drilldownData = {};

  constructor() {
    super();
    this.highchartsPromise = loadHighchartsModule('drilldown');
  }

  protected getSpecificChartOptions(): Options {
    const seriesData = this.data.map((item: any) => ({
      name: item[this.xField],
      y: item[this.yField],
      drilldown: this.drilldownData.hasOwnProperty(item[this.xField])
        ? item[this.xField]
        : null,
    }));

    const drilldownSeries = Object.entries(this.drilldownData).map(
      ([key, value]: [string, any]) => ({
        name: key,
        id: key,
        data: value,
        type: 'bar' as const,
      })
    );

    return {
      chart: {
        type: 'bar',
        events: {
          drilldown: (e: any) => {
            this.dispatchEvent(
              new CustomEvent('oneviz-drilldown', {
                detail: { point: e.point.options, source: this },
                bubbles: true,
                composed: true,
              })
            );
          },
          drillup: () => {
            this.dispatchEvent(
              new CustomEvent('oneviz-drillup', {
                detail: { source: this },
                bubbles: true,
                composed: true,
              })
            );
          },
        },
      },
      title: {
        text: '', // Title is handled by the component's template
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: this.yField,
        },
      },
      series: [
        {
          type: 'bar',
          name: this.yField,
          data: seriesData,
          showInLegend: false,
        },
      ],
      drilldown: {
        series: drilldownSeries,
      },
    };
  }
}

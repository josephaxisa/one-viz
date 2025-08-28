import { customElement, property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { loadHighchartsModule } from '../../utils/cdn-loader';

@customElement('oneviz-heatmap')
export class OneVizHeatmapChart extends AbstractChart {
  @property({ type: Array }) xCategories: string[] = [];
  @property({ type: Array }) yCategories: string[] = [];
  @property({ type: String, attribute: 'color-axis' })
  colorAxis = JSON.stringify({
    min: 0,
    minColor: '#FFFFFF',
    maxColor: window.Highcharts?.defaultOptions.colors?.[0] || '#007bff',
  });

  constructor() {
    super();
    this.highchartsPromise = loadHighchartsModule('heatmap');
  }

  protected getSpecificChartOptions(): Options {
    const styles = getComputedStyle(this);
    const minColor = styles.getPropertyValue('--oneviz-color-2').trim() || '#FFFFFF';
    const maxColor = styles.getPropertyValue('--oneviz-color-1').trim() || '#007bff';

    return {
      chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1,
      },
      title: {
        text: '', // Title is handled by the component's template
      },
      xAxis: {
        categories: this.xCategories,
      },
      yAxis: {
        categories: this.yCategories,
        title: undefined,
        reversed: true,
      },
      colorAxis: {
        min: 0,
        minColor: minColor,
        maxColor: maxColor,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280,
      },
      tooltip: {
        formatter: function () {
          const point = this.point as Highcharts.Point & { value: number };
          if (point && this.series && this.series.yAxis.categories && this.series.xAxis.categories && point.y !== undefined) {
            return `<b>${this.series.xAxis.categories[point.x]}</b> sold <br><b>${
              point.value
            }</b> items on <br><b>${this.series.yAxis.categories[point.y]}</b>`;
          }
          return '';
        },
      },
      series: [
        {
          type: 'heatmap',
          name: 'Sales per employee',
          borderWidth: 1,
          data: this.data,
          dataLabels: {
            enabled: true,
            color: '#000000',
          },
        },
      ],
    };
  }
}

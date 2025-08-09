import { customElement } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-barchart')
export class OneVizBarChart extends AbstractChart {
  
  getChartOptions(): Options | null {
    if (!this.data || this.data.length === 0) {
        return null;
    }

    const seriesData = this.data.map((item: any) => item[this.yField]);
    const categories = this.data.map((item: any) => item[this.xField]);

    return {
      chart: {
        type: 'bar'
      },
      title: {
        text: '' // Title is handled by the component's template
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
      series: [{
        type: 'bar',
        name: this.yField,
        data: seriesData,
        showInLegend: false,
        point: {
            events: {
                click: (event: any) => {
                    this.dispatchEvent(new CustomEvent('oneviz-bar-click', {
                        detail: {
                            category: event.point.category,
                            value: event.point.y,
                            originalEvent: event
                        },
                        bubbles: true,
                        composed: true
                    }));
                }
            }
        }
      }]
    };
  }
}

import { customElement } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-scatterchart')
export class OneVizScatterChart extends AbstractChart {
  
  getSpecificChartOptions(): Options | null {
    if (!this.data || this.data.length === 0) {
        return null;
    }

    const seriesData = this.data.map((item: any) => ({
        x: item[this.xField],
        y: item[this.yField]
    }));

    return {
      chart: {
        type: 'scatter'
      },
      title: {
        text: '' // Title is handled by the component's template
      },
      xAxis: {
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
        type: 'scatter',
        name: `${this.yField} vs ${this.xField}`,
        data: seriesData,
        showInLegend: false,
        point: {
            events: {
                click: (event: any) => {
                    this.dispatchEvent(new CustomEvent('oneviz-scatter-click', {
                        detail: {
                            x: event.point.x,
                            y: event.point.y,
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

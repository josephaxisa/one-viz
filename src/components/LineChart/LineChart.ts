import { customElement } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { css } from 'lit';

@customElement('oneviz-linechart')
export class OneVizLineChart extends AbstractChart {

  static styles = css`
    :host {
      --oneviz-line-color: #007bff;
    }
  `;

  getChartOptions(): Options | null {
    if (!this.data || this.data.length === 0) {
        return null;
    }

    const seriesData = this.data.map((item: any) => item[this.yField]);
    const categories = this.data.map((item: any) => item[this.xField]);

    return {
      chart: {
        type: 'line'
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
        type: 'line',
        name: this.yField,
        data: seriesData,
        color: 'var(--oneviz-line-color)',
        showInLegend: false,
        point: {
            events: {
                click: (event: any) => {
                    this.dispatchEvent(new CustomEvent('oneviz-line-click', {
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

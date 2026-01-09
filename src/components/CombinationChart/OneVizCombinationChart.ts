import { customElement, property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';

@customElement('oneviz-combinationchart')
export class OneVizCombinationChart extends AbstractChart {
  @property({ type: String, attribute: 'bar-field' }) barField = '';
  @property({ type: String, attribute: 'line-field' }) lineField = '';
  @property({ type: Boolean, attribute: 'secondary-y-axis' }) secondaryYAxis = false;

  protected validateData(): boolean {
    if (!this.data || this.data.length === 0) return false;

    const sample = this.data[0];
    const requiredFields = [this.xField, this.barField, this.lineField].filter(Boolean);

    for (const field of requiredFields) {
      if (!(field in sample)) {
        console.error(`One-viz chart [${this.title || this.constructor.name}] is missing required field '${field}' in the data.`);
        return false;
      }
    }
    return true;
  }

  protected getSpecificChartOptions(): Options {
    const categories = this.data.map((item: any) => item[this.xField]);
    const barData = this.data.map((item: any) => item[this.barField]);
    const lineData = this.data.map((item: any) => item[this.lineField]);

    const yAxis: any[] = [
      {
        title: {
          text: this.barField,
        },
      },
    ];

    if (this.secondaryYAxis) {
      yAxis.push({
        title: {
          text: this.lineField,
        },
        opposite: true,
      });
    }

    return {
      title: {
        text: '',
      },
      xAxis: {
        categories: categories,
        title: {
          text: this.xField,
        },
      },
      yAxis: yAxis,
      series: [
        {
          type: 'column',
          name: this.barField,
          data: barData,
          yAxis: 0,
          point: {
            events: {
              click: (event: any) =>
                this.pointClickCallback(event.point.category),
            },
          },
        },
        {
          type: 'line',
          name: this.lineField,
          data: lineData,
          yAxis: this.secondaryYAxis ? 1 : 0,
          point: {
            events: {
              click: (event: any) =>
                this.pointClickCallback(event.point.category),
            },
          },
        },
      ],
    };
  }
}

import { customElement, property } from 'lit/decorators.js';
import type { Options } from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { css } from 'lit';

@customElement('oneviz-piechart')
export class OneVizPieChart extends AbstractChart {
  @property({ type: Boolean, attribute: 'show-legend'}) showLegend: boolean = true;

  static override styles = css`
    :host {
      display: block;
    }
  `;

  getChartOptions(): Options | null {
    if (this.data.length === 0) {
        return null;
    }

    const seriesData = this.data.map((item) => ({
      name: String(item[this.xField as keyof typeof item]),
      y: Number(item[this.yField as keyof typeof item]),
    }));

    return {
      chart: {
        type: 'pie',
        plotShadow: false,
        backgroundColor: 'var(--oneviz-chart-background-color, #FFFFFF)',
      },
      title: {
        text: this.title,
        style: {
          color: 'var(--oneviz-chart-title-color, #333333)',
          fontSize: 'var(--oneviz-chart-title-font-size, 18px)',
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
                color: 'var(--oneviz-chart-datalabel-color, #333333)',
            }
          },
          showInLegend: this.showLegend,
        },
      },
      series: [
        {
          type: 'pie',
          name: this.yField || 'Value',
          colorByPoint: true,
          data: seriesData,
        } as any,
      ],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: this.showLegend,
        itemStyle: {
            color: 'var(--oneviz-chart-legend-text-color, #333333)',
        }
      }
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'oneviz-piechart': OneVizPieChart;
  }
}

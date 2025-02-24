import { customElement, property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';
import { AbstractChart, ChartData } from '../AbstractChart'; 
import { html, css } from 'lit';

@customElement('oneviz-linechart')
export class OneVizLineChart extends AbstractChart { 

  static styles = [
    AbstractChart.styles,
    css`
      /* Line-chart specific styles here (if any) */
      :host {
        --oneviz-line-color: #007bff;
      }
    `
  ];
    @property({ type: String }) override title: string = 'OneViz Line Chart';


  createChart() {
    if (!this.data || this.data.length === 0 || !this.xField || !this.yField) {
      return;
    }

    const categories = this.data.map((item) => String(item[this.xField]));
    const seriesData = this.data.map((item) => Number(item[this.yField]));

    if (this.chart) {
        this.chart.destroy();
    }


    this.chart = Highcharts.chart(this.shadowRoot!.getElementById('chart')!, {
      chart: {
        type: 'line'
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
        },
        min: 0,
      },
      series: [{
        type: 'line',
        name: this.yField,
        data: seriesData,
        color: 'var(--oneviz-line-color)',
          point: {
              events: {
                  click: (event: Highcharts.PointClickEventObject) => {
                      this.dispatchEvent(new CustomEvent('oneviz-line-click', {
                          detail: {
                              x: event.point.category,
                              y: event.point.y,
                              originalEvent: event
                          },
                          bubbles: true,
                          composed: true
                      }));
                  }
              }
          }
      }],
      credits: {
        enabled: false
      },
        tooltip: { 
            pointFormat: '<b>{point.y}</b><br/>{point.category}',
        }
    });
  }
}
import { customElement, property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';
import { AbstractChart, ChartData } from './AbstractChart';
import { html, css } from 'lit';

@customElement('oneviz-barchart')
export class OneVizBarChart extends AbstractChart {

  static styles = [
    AbstractChart.styles,
    css`
      :host {
        --oneviz-bar-color: #4CAF50;
      }
    `
  ];
    @property({ type: String }) override title: string = 'OneViz Bar Chart';

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
        type: 'bar'
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
        type: 'bar',
        name: this.yField,
        data: seriesData,
        color: 'var(--oneviz-bar-color)',
        point: { // Add the event handler here
          events: {
            click: (event: Highcharts.PointClickEventObject) => {
              this.dispatchEvent(new CustomEvent('oneviz-bar-click', {
                detail: {
                  x: event.point.category, // x-axis value (category)
                  y: event.point.y,        // y-axis value
                  originalEvent: event     // The original Highcharts event
                },
                bubbles: true,   // Allow the event to bubble up the DOM
                composed: true  // Allow the event to cross the shadow DOM boundary
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
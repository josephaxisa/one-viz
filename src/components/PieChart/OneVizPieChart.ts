import { customElement, property } from 'lit/decorators.js';
import * as Highcharts from 'highcharts';
import { AbstractChart } from '../AbstractChart/AbstractChart';
import { css } from 'lit';

@customElement('oneviz-piechart')
export class OneVizPieChart extends AbstractChart {
  @property({ type: Boolean, attribute: 'show-legend'}) showLegend: boolean = true;

  static override styles = css`
    :host {
      /* Specific styles for pie chart can go here if needed */
      /* For example, you might want to ensure it's displayed as a block */
      display: block;
    }
  `;

  // For a pie chart, xField represents the 'name' or 'label' of the slice,
  // and yField represents the 'value' or 'y' of the slice.

  override createChart() {
    // Ensure data and necessary fields are provided
    if (!this.data || this.data.length === 0 || !this.xField || !this.yField) {
      // Optionally, render a message or clear the chart if it exists
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }
      const chartContainer = this.shadowRoot?.getElementById('chart');
      if (chartContainer) {
        chartContainer.innerHTML = 'No data or fields configured for Pie Chart.';
      }
      return;
    }

    // Transform the generic data into Highcharts pie series format
    // [{ name: 'Slice 1', y: value1 }, { name: 'Slice 2', y: value2 }, ...]
    const seriesData = this.data.map((item) => ({
      name: String(item[this.xField as keyof typeof item]), // Use xField for the slice name
      y: Number(item[this.yField as keyof typeof item]),   // Use yField for the slice value
    }));

    if (this.chart) {
      this.chart.destroy();
    }

    const chartOptions: Highcharts.Options = {
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
        // Basic tooltip, will be enhanced in a later commit
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

    // Render the chart
    const chartContainer = this.shadowRoot?.getElementById('chart');
    if (chartContainer) {
      this.chart = Highcharts.chart(chartContainer, chartOptions);
    } else {
      console.error('Chart container not found for OneVizPieChart.');
    }
  }

  // `requestUpdate` is called by Lit when properties change.
  // We override it to ensure `createChart` is called after updates.
  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties); // Call super.updated() for AbstractChart logic

    // Check if relevant properties have changed to decide if chart needs recreation
    if (
      changedProperties.has('data') ||
      changedProperties.has('xField') ||
      changedProperties.has('yField') ||
      changedProperties.has('title') ||
      changedProperties.has('showLegend')
    ) {
      this.createChart();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'oneviz-piechart': OneVizPieChart;
  }
}

import { html } from 'lit';
import { fixture, expect, assert } from '@open-wc/testing';
import { OneVizBarChart } from './one-viz-barchart'; 
import * as Highcharts from 'highcharts';

// Mock Highcharts (ESSENTIAL)
jest.mock('highcharts', () => ({
    __esModule: true,
    default: {
        chart: jest.fn().mockImplementation(() => ({
            setTitle: jest.fn(),
            series: [{
                setData: jest.fn(),
                update: jest.fn(),
            }],
            destroy: jest.fn(),
            setSize: jest.fn(),
            redraw: jest.fn(),
            xAxis: [{ update: jest.fn() }],  
            yAxis: [{ update: jest.fn(), setExtremes: jest.fn() }], 
        })),
        setOptions: jest.fn(), //If you use setOptions.
    },
}));

describe('OneVizBarChart', () => {
    let element: OneVizBarChart;
    let chartInstance: any;

    beforeEach(async () => {
        element = await fixture(html`<one-viz-barchart></one-viz-barchart>`);
        chartInstance = (Highcharts.default.chart as jest.Mock).mock.results[0].value;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default properties', async () => {
        expect(element).to.be.accessible();
        expect(element.title).to.equal('OneViz Bar Chart');
        expect(element.data).to.be.undefined;
        expect(element.xField).to.be.undefined;
        expect(element.yField).to.be.undefined;
        expect(Highcharts.default.chart).not.toHaveBeenCalled(); 
    });

    it('renders with a custom title', async () => {
        element.title = 'Custom Bar Chart Title';
        element.data = [{ category: 'A', value: 10 }]; // Provide data
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;
         const titleOptions = (Highcharts.default.chart as jest.Mock).mock.calls[0][1].title;
        expect(titleOptions.text).to.equal('Custom Bar Chart Title');
    });

    it('renders with provided data, xField, and yField', async () => {
        const testData = [
            { category: 'A', value: 30 },
            { category: 'B', value: 70 },
        ];
        element.data = testData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        const chartOptions = (Highcharts.default.chart as jest.Mock).mock.calls[0][1];

        expect(chartOptions.chart.type).to.equal('bar');
        expect(chartOptions.xAxis.categories).to.deep.equal(['A', 'B']);
        expect(chartOptions.series[0].data).to.deep.equal([30, 70]);
        expect(chartOptions.series[0].name).to.equal('value');
        expect(chartOptions.yAxis.min).to.equal(0); 
    });

     it('handles empty data gracefully', async () => {
        element.data = [];
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;
        expect(Highcharts.default.chart).not.toHaveBeenCalled(); 
    });

    it('handles missing xField or yField gracefully', async () => {
        element.data = [{ category: 'A', value: 30 }];
        // Don't set xField or yField
        await element.updateComplete;
        expect(Highcharts.default.chart).not.toHaveBeenCalled();
    });
    it('updates the chart when data changes', async () => {
        const initialData = [
            { category: 'A', value: 30 },
        ];
        const newData = [
            { category: 'C', value: 50 },
            { category: 'D', value: 50 },
        ];
        element.data = initialData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

       const setDataMock = chartInstance.series[0].setData

        element.data = newData;
        await element.updateComplete;

        expect(setDataMock).toHaveBeenCalledWith([50, 50], true); 
    });

    it('updates the chart when xField changes', async () => {
        const initialData = [
            { category: 'A', value: 30, otherX: 'X' },
        ];

        element.data = initialData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        const xAxisUpdateMock = chartInstance.xAxis[0].update;
        element.xField = "otherX";
        await element.updateComplete;
        expect(xAxisUpdateMock).toHaveBeenCalled();

    });

    it('updates the chart when yField changes', async () => {
        const initialData = [
           { category: 'A', value: 30, otherY: 50 },
        ];

        element.data = initialData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        const yAxisUpdateMock = chartInstance.yAxis[0].update;
        element.yField = "otherY"
        await element.updateComplete;
        expect(yAxisUpdateMock).toHaveBeenCalled();
        expect(chartInstance.series[0].setData).toHaveBeenCalledWith([50], true); 
    });
    it('dispatches a oneviz-bar-click event with correct data', async () => {
        const testData = [{ category: 'A', value: 50 }];
        element.data = testData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        const point = {
            category: 'A',
            y: 50,
            series: {
                chart: chartInstance,
            },
        };

        const eventSpy = jest.spyOn(element, 'dispatchEvent');

        // Simulate the Highcharts click event (your component handles this internally)
        const highchartsClickEvent = new Event('click') as Highcharts.PointClickEventObject;
        highchartsClickEvent.point = point as any;
        chartInstance.series[0].point.events.click(highchartsClickEvent); 


        expect(eventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
        const dispatchedEvent: CustomEvent = eventSpy.mock.calls[0][0];
        expect(dispatchedEvent.type).toBe('oneviz-bar-click');
        expect(dispatchedEvent.detail).toEqual({
            x: 'A',
            y: 50,
            originalEvent: highchartsClickEvent, 
        });

        eventSpy.mockRestore();
    });

    it('handles null/undefined data', async () => {
        element.data = null;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;
        expect(Highcharts.default.chart).not.toHaveBeenCalled();

        element.data = undefined;
        await element.updateComplete;
        expect(Highcharts.default.chart).not.toHaveBeenCalled();
    });

     it('handles data with missing x or y values', async () => {
        const dataWithMissingValues = [
          { category: 'A', value: 10 },
          { value: 5 },  // Missing category (xField)
          { category: 'C' }, // Missing value (yField)
          { category: 'D', value: null }, // Null y value
          { category: null, value: 8 }, // Null x value
          { category: 'E', value: 12 }
        ];

        element.data = dataWithMissingValues;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        const chartOptions = (Highcharts.default.chart as jest.Mock).mock.calls[0][1];
         // Check that only valid data points are used
        expect(chartOptions.xAxis.categories).toEqual([ 'A', 'E' ]);
        expect(chartOptions.series[0].data).toEqual([ 10, 12 ]);
    });

    it('cleans up Highcharts on disconnectedCallback', async () => {
        element.remove();
        expect(chartInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('sets the correct CSS variable', async () => {
        // Check if the CSS variable is set correctly.  This uses getComputedStyle.
        const computedStyles = getComputedStyle(element);
        expect(computedStyles.getPropertyValue('--oneviz-bar-color')).toBe('#4CAF50');
    });
     it('updates chart options when title changes', async() => {
        element.title = "New Title";
        element.data = [{ category: 'A', value: 10 }];
        element.xField = "category";
        element.yField = 'value';
        await element.updateComplete;
        const chartInstance = (Highcharts.default.chart as jest.Mock).mock.results[0].value;
        const setTitleMock = chartInstance.setTitle
        expect(setTitleMock).toHaveBeenCalledWith({text: "New Title"}, true);
    });
     it('updates y axis min when yField changes to a field with negative values', async () => {
        const testData = [
            { category: 'A', value: 30, negativeValue: -10 },
            { category: 'B', value: 70, negativeValue: -20 },
        ];
        element.data = testData;
        element.xField = 'category';
        element.yField = 'value';
        await element.updateComplete;

        element.yField = 'negativeValue';
        await element.updateComplete;

        expect(chartInstance.yAxis[0].setExtremes).toHaveBeenCalledWith(null, null, true, true); 
    });
});
import * as prettyFormat from 'pretty-format';
import BubbleChart from '.';
import db from '../../db';

describe('Bubble chart DW module tests', () => {
    const bubbleChart = new BubbleChart(db);

    it('getting poverty  bubble chart data i.e poverty & revenue per person data', async () => {
        const data = await bubbleChart.getBubbleChartPoverty();
        expect(data).toMatchSnapshot();
    }, 30000);

    it('getting oda  bubble chart ODA data', async () => {
        const data = await bubbleChart.getBubbleChartOda();
        expect(data).toMatchSnapshot();
    }, 30000);
    it('getting oda  bubble chart indicators selection list', async () => {
        const data = await bubbleChart.getBubbleChartIndicatorsList();
        expect(data).toMatchSnapshot();
    }, 30000);
    it('should get bubble chart size data for a countrys ODA', async () => {
        const data = await bubbleChart.getBubbleSize({id: 'AT'});
        expect(data).toMatchSnapshot();
    }, 30000);
    it('should get bubble chart size data for a generic indicator', async () => {
        const data = await bubbleChart.getBubbleSize({id: 'data_series.fdi_pp'});
        expect(data).toMatchSnapshot();
    }, 30000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

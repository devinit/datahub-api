import {prettyListMany, replaceUidInList} from '@devinit/graphql-next/lib/utils/test.utils';
import BubbleChart from '.';
import db from '@devinit/graphql-next/lib/db';
import * as prettyFormat from 'pretty-format';

describe('Bubble chart DW module tests', () => {
    const bubbleChart = new BubbleChart(db);

    it('getting poverty  bubble chart data i.e poverty & revenue per person data', async () => {
        const data = await bubbleChart.getBubbleChartPoverty();
        const dataB = await bubbleChart.getBubbleChartPoverty('AT');
        expect(prettyListMany([data, dataB])).toMatchSnapshot();
    }, 30000);

    it('getting oda  bubble chart ODA data', async () => {
        const data = await bubbleChart.getBubbleChartOda();
        const dataB = await bubbleChart.getBubbleChartOda('data_series.fdi_pp');
        expect(prettyListMany([data, dataB])).toMatchSnapshot();
    }, 30000);
    it('getting bubble chart options', async () => {
        const data = await bubbleChart.getBubbleChartOptions();
        expect(data).toMatchSnapshot();
    }, 30000);
    it('should get bubble chart size data for a countrys ODA in poverty chart', async () => {
        const data = await bubbleChart.getBubbleSize('AT');
        const result = replaceUidInList(data);
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 30000);
    it('should get bubble chart size data for a generic indicator', async () => {
        const data = await bubbleChart.getBubbleSize('data_series.fdi_pp');
        const result = replaceUidInList(data);
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 30000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

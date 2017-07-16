import Maps from '.';
import * as prettyFormat from 'pretty-format';
import * as d3 from 'd3';
import db from '../../db';

describe('Maps module tests', () => {
    const maps = new Maps(db);

    it('should return only DAC countries from the data', async () => {
        const dacCountries = ['Spain', 'England'];
        const data = [
            {value: 2000, id: 'sp', name: 'Spain', year: 2000},
            {value: 2000, id: 'uk', name: 'Engaland', year: 2000},
            {value: 2000, id: 'pl', name: 'Poland', year: 2000},
            ];
        const onlyDacCountries = Maps.DACOnlyData(dacCountries, data);
        expect(onlyDacCountries.length).toBe(2);
    }, 10000);
    it('should return poverty indicator data', async () => {
        const data = await maps.getMapData({id: 'data_series.depth_of_extreme_poverty_190', DACOnly: false});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 20000);
    it ('should return color value for a data value', async () => {
        const ramp = {high: '#8f1b13', low: '#f8c1b2', mid: '#e8443a'};
        const scale = Maps.colorScale('1, 5, 10, 20', ramp);
        expect(prettyFormat({
            start: scale(0.23), mid: scale(5), midA: scale(15), end: scale(100)
        })).toMatchSnapshot();
    });
    it ('should create color ramp', async () => {
        const ramp = {high: '#8f1b13', low: '#f8c1b2', mid: '#e8443a'};
        const colorRamp = await Maps.getColorRamp('red');
        expect(colorRamp).toBe(ramp);
    }, 20000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

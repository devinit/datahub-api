import Maps from '.';
import * as prettyFormat from 'pretty-format';
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
    it ('should return poverty indicator data', async () => {
        const data = await maps.getMapData({id: 'data_series.depth_of_extreme_poverty_190', DACOnly: false});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 20000);
});

import * as prettyFormat from 'pretty-format';
import {getDistrictBySlugAsync, getDistrictEntities} from '.';

describe('spotlight reference module test', () => {

    it('should return uganda district entities', async () => {
        const uganda = await getDistrictEntities('uganda');
        const kenya = await getDistrictEntities('kenya');
        expect(prettyFormat({kenya, uganda})).toMatchSnapshot();
    }, 20000);
    it('should return details about a uganda district', async () => {
        const districts = await getDistrictBySlugAsync('uganda', 'wakiso');
        expect(prettyFormat(districts)).toMatchSnapshot();
    }, 20000);
});

import 'jest';
import {csvToJson, get, httpsGet} from './connector';
import * as prettyFormat from 'pretty-format';

describe('Github connector', () => {

    it.skip('should turn csv string to json Array', async () => {
        const csvStrA = `id,value
                        red,#e8443
                        red-light,#f0826d
                        red-lighter,#f8c1b2`;
        const dataA = await csvToJson<{name: string; id: number}>(csvStrA);
        expect(prettyFormat(dataA)).toMatchSnapshot();
    });
    it('should be able to get color data from github', async () => {
        const raw = await httpsGet('global/entity.csv');
        expect(raw.length).toBeGreaterThan(30);
        expect(prettyFormat(raw)).toMatchSnapshot();
    }, 10000);

    it('should get data from github and return it as json', async () => {
        const themes = await get<{id: string}>('global-picture/theme.csv');
        expect(themes.length).toBeGreaterThan(2);
        expect(prettyFormat(themes)).toMatchSnapshot();
    }, 10000);
});

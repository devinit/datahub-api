import 'jest';
import {csvToJson, get, httpsGet} from './connector';
import * as prettyFormat from 'pretty-format';

describe('Github connector', () => {

    it('should turn csv string to json Array', async () => {
        const csvStr = `id,name
                        20,allan
                        30,alex`;
        const data = await csvToJson<{name: string; id: number}>(csvStr);
        expect(data.length).toBe(2);
        expect(data[0].name).toBe('allan');
    });

    it('should be able to get data from github', async () => {
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

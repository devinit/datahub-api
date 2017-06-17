import 'jest';
import {csvToJson, get} from './connector';

describe('Github connector', () => {

    it('should turn csv string to json Array', async () => {
        const csvStr = `id,name
                        20,allan
                        30,alex`;
        const data = await csvToJson<{name: string}>(csvStr);
        expect(data.length).toBe(2);
        expect(data[0].name).toBe('allan');
    });

    it('should get data from github and return it as json', async () => {
        const themes = await get<{id: string}>('global-picture/themes.csv');
        expect(themes.length).toBeGreaterThan(4);
        expect(themes[0].id).toBe('poorest20pct');
    });

});

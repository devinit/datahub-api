import 'jest';
import {readCacheData, ICached} from '.';
import * as prettyFormat from 'pretty-format';
import * as path from 'path';

describe('cache module tests', () => {
    const cachePath = path.resolve(__dirname, './test-data/.cache');

    it('should read precache file and return an array of JS objects', async () => {
        try {
            const cachedData: ICached[] = await readCacheData(cachePath);
            expect(cachedData[0].key).toBe('global-picture/themes.csv');
            expect(prettyFormat(cachedData)).toMatchSnapshot();
        } catch (error) {
            console.log(error);
        }
    });
});

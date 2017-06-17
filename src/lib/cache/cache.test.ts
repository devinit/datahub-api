import 'jest';
import {readCacheData, ICached} from '.';
import * as prettyFormat from 'pretty-format';
import {isError} from '../isType';
import * as path from 'path';

describe('cache module tests', () => {
    const cachePath = path.resolve(__dirname, './test-data/.cache');

    it('should read precache file and return an array of JS objects', async () => {
        const cachedData: ICached[] | Error = await readCacheData(cachePath);
        if (isError(cachedData)) console.error(cachedData);
        expect(cachedData[0].key).toBe('global-picture/themes.csv');
        expect(prettyFormat(cachedData)).toMatchSnapshot();
    });
});

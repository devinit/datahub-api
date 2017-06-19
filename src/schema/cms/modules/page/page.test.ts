import 'jest';
import {getPageData} from '.';

describe('Github page data tests', () => {
    it('should get data from page.csv of a module on github', async () => {
        const pageData: DH.IPage[] = await getPageData('global-picture');
        expect(pageData.length).toBeGreaterThan(2);
        expect(pageData[0].id).toBe('introduction');
    }, );
});

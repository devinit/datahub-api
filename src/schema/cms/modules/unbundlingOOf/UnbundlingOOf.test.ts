import {getUnbundlingOOfPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('Unbundling OOf module tests', () => {
    it('should return page data for  Unbundling OOf', async () => {
        const pageData: DH.IPage[] = await getUnbundlingOOfPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
});

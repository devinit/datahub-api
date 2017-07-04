import {getWhereThePoorPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('Where The Poor module tests', () => {
    it('should return page data for Where The Poor', async () => {
        const pageData: DH.IPage[] = await getWhereThePoorPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
});

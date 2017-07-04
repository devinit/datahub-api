import {getUnbundlingOdaPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('Unbundling Oda module tests', () => {
    it('should return page data for the Unbundling Oda', async () => {
        const pageData: DH.IPage[] = await getUnbundlingOdaPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
});

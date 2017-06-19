import {getSpotlightUgandaPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('Spotlight Uganda module tests', () => {
    it('should return page data for Spotlight Uganda', async () => {
        const pageData: DH.IPage[] = await getSpotlightUgandaPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, );
});

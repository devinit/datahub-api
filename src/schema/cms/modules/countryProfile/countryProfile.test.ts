import {getCountryProfilePageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('country profile module tests', () => {
    // TOFIX: skipped coz it fails over network request issue
    it.skip('should return page data for a country slug', async () => {
        const pageData: DH.IPage[] = await getCountryProfilePageData('usa');
        expect(pageData.length).toBeGreaterThan(2);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 50000);
});

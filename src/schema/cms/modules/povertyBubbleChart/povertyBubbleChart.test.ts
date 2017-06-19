import {getPovertyBubbleChartPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('Poverty bubble chart module tests', () => {
    it('should return page data for the Poverty bubble chart', async () => {
        const pageData: DH.IPage[] = await getPovertyBubbleChartPageData();
      //  console.log(pageData[0]);
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, );
});

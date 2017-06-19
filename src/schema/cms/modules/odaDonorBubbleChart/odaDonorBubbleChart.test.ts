import {getOdaDonorBubbleChartPageData} from '.';
import * as prettyFormat from 'pretty-format';

describe('ODA donor bubble chart module tests', () => {
    it('should return page data for the ODA donor bubble chart', async () => {
        const pageData: DH.IPage[] = await getOdaDonorBubbleChartPageData();
      //  console.log(pageData[0]);
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, );
});

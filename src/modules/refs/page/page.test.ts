import 'jest';
import {
    getCountryProfilePageData,
    getPovertyBubbleChartPageData,
    getOdaDonorBubbleChartPageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    getAboutPageData,
    getFooterPageData,
    getFrontPageData
} from '.';
import * as prettyFormat from 'pretty-format';

describe('Page data', () => {
    it.skip('should return page data for a country profile', async () => {
        const pageData = await getCountryProfilePageData();
        expect(pageData.length).toBeGreaterThan(2);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 100000);
    it.skip('should return page data for the Poverty bubble chart', async () => {
        const pageData = await getPovertyBubbleChartPageData();
        //  console.log(pageData[0]);
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for the ODA donor bubble chart', async () => {
        const pageData = await getOdaDonorBubbleChartPageData();
        //  console.log(pageData[0]);
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for the Unbundling Oda', async () => {
        const pageData = await getUnbundlingOdaPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for  Unbundling OOf', async () => {
        const pageData = await getUnbundlingOOfPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for Where The Poor', async () => {
        const pageData = await getWhereThePoorPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for about', async () => {
        const pageData = await getAboutPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it.skip('should return page data for footer', async () => {
        const pageData = await getFooterPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
    it('should return page data for front page', async () => {
        const pageData = await getFrontPageData();
        expect(pageData.length).toBeGreaterThan(0);
        expect(prettyFormat(pageData)).toMatchSnapshot();
    }, 10000);
});

import {githubGet} from '@devinit/graphql-next/lib/github';

const getPageData = (moduleName: string): Promise <DH.IPage[]> => {
    const endPoint: string = `${moduleName}/page.csv`;
    return githubGet<DH.IPage>(endPoint);
};
export const getDistrictPageData = (country: string): Promise<DH.IPage[]> =>
    getPageData(`spotlight-${country}/district-profile`);
export const getCountryProfilePageData = (): Promise<DH.IPage[]> => getPageData('country-profile');
export const getGlobalPicturePageData = (): Promise<DH.IPage[]> => getPageData('global-picture');
export const getPovertyBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('bubble-chart-poverty');
export const getOdaDonorBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('bubble-chart-oda');
export const getUnbundlingOdaPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oda');
export const getUnbundlingOOfPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oof');
export const getWhereThePoorPageData = (): Promise<DH.IPage[]> => getPageData('where-the-poor');
export const getAboutPageData = (): Promise<DH.IPage[]> => getPageData('about-page');
export const getFrontPageData = (): Promise<DH.IPage[]> => getPageData('front-page');
export const getSpotlightGeneralPageData = (): Promise<DH.IPage[]> => getPageData('spotlight-general');
export const getUnbundlingAidPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-aid-page');

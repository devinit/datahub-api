import {getSpotlightThemes, getGlobalPictureThemes} from './theme';
import {getMethodologyData} from './concept';
import {
    getCountryProfilePageData,
    getGlobalPicturePageData,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    getDistrictPageData,
    getAboutPageData,
    getFrontPageData,
    getSpotlightPageData,
    getUnbundlingAidPageData,
    getBubbleChartAnnotationPageData
} from './page';
import {getCountries} from './global';
import {getDistrictEntities} from './spotlight';

export interface IRefs {
    getSpotlightThemes;
    getMethodologyData;
    getGlobalPictureThemes;
    getGlobalPicturePageData;
    getOdaDonorBubbleChartPageData;
    getPovertyBubbleChartPageData;
    getDistrictPageData;
    getCountryProfilePageData;
    getUnbundlingOdaPageData;
    getUnbundlingOOfPageData;
    getDistrictEntities;
    getWhereThePoorPageData;
    getCountries;
    getAboutPageData;
    getFrontPageData;
    getSpotlightPageData;
    getUnbundlingAidPageData;
    getBubbleChartAnnotationPageData;
}

const refs: IRefs = {
    getSpotlightThemes,
    getMethodologyData,
    getGlobalPictureThemes,
    getGlobalPicturePageData,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getDistrictPageData,
    getCountryProfilePageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getDistrictEntities,
    getWhereThePoorPageData,
    getCountries,
    getAboutPageData,
    getFrontPageData,
    getSpotlightPageData,
    getUnbundlingAidPageData,
    getBubbleChartAnnotationPageData
};

export default [{refs: () => refs}];

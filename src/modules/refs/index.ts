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
    getBubbleChartAnnotationPageData,
    getWhoAreTheGlobalP20PageData,
    getProfileHeaderPageData
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
    getWhoAreTheGlobalP20PageData;
    getProfileHeaderPageData;
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
    getBubbleChartAnnotationPageData,
    getWhoAreTheGlobalP20PageData,
    getProfileHeaderPageData
};

export default [{refs: () => refs}];

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
};

export default [{refs: () => refs}];

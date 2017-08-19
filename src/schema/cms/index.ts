import {getSpotlightThemes, getGlobalPictureThemes} from './modules/theme';
import {getMethodologyData} from './modules/concept';
import {
    getCountryProfilePageData,
    getGlobalPicturePageData,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    getDistrictPageData,
} from './modules/page';
import { get} from './connector';
import {getCountries} from './modules/global';
import {getDistrictEntities} from './modules/spotlight';

// TODO: replace any with proper types
export interface ICms {
    getSpotlightThemes: any;
    getMethodologyData: any;
    getGlobalPictureThemes: any;
    getGlobalPicturePageData: any;
    getOdaDonorBubbleChartPageData: any;
    getPovertyBubbleChartPageData: any;
    getDistrictPageData: any;
    getCountryProfilePageData: any;
    getUnbundlingOdaPageData: any;
    getUnbundlingOOfPageData: any;
    getDistrictEntities: any;
    getWhereThePoorPageData: any;
    get: any;
    getCountries: any;
}

const cms: ICms = {
    getGlobalPicturePageData,
    getMethodologyData,
    getSpotlightThemes,
    getGlobalPictureThemes,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getCountryProfilePageData,
    getDistrictPageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    getDistrictEntities,
    get,
    getCountries
};

export default cms;

import {getSpotlightThemes, getGlobalPictureThemes} from './modules/theme';
import {
    getCountryProfilePageData,
    getGlobalPicturePageData,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
} from './modules/page';
import { get} from './connector';
import {getCountries} from './modules/global';

export interface ICms {
    getSpotlightThemes: any;
    getGlobalPictureThemes: any;
    getGlobalPicturePageData: any;
    getOdaDonorBubbleChartPageData: any;
    getPovertyBubbleChartPageData: any;
    getCountryProfilePageData: any;
    getUnbundlingOdaPageData: any;
    getUnbundlingOOfPageData: any;
    getWhereThePoorPageData: any;
    get: any;
    getCountries: any;
}

const cms: ICms = {
    getGlobalPicturePageData,
    getSpotlightThemes,
    getGlobalPictureThemes,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getCountryProfilePageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    get,
    getCountries
};

export default cms;

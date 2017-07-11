import {getGlobalPicturePageData, getGlobalPictureThemes} from './modules/globalPicture';
import {getCountryProfilePageData} from './modules/countryProfile';
import {getOdaDonorBubbleChartPageData} from './modules/odaDonorBubbleChart';
import {getPovertyBubbleChartPageData} from './modules/povertyBubbleChart';
import {getUnbundlingOdaPageData} from './modules/unbundlingOda';
import {getUnbundlingOOfPageData} from './modules/unbundlingOOf';
import {getWhereThePoorPageData} from './modules/whereThePoor';
import {getCountries} from './modules/global';
import {get} from './connector';

export interface ICms {
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

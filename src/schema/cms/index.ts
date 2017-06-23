import {getGlobalPicturePageData, getGlobalPictureThemes} from './modules/globalPicture';
import {getCountryProfilePageData} from './modules/countryProfile';
import {getOdaDonorBubbleChartPageData} from './modules/odaDonorBubbleChart';
import {getPovertyBubbleChartPageData} from './modules/povertyBubbleChart';
import {getUnbundlingOdaPageData} from './modules/UnbundlingOda';
import {getUnbundlingOOfPageData} from './modules/UnbundlingOOf';
import {getWhereThePoorPageData} from './modules/whereThePoor';
import {get} from './connector';

const cms = {
    getGlobalPicturePageData,
    getGlobalPictureThemes,
    getOdaDonorBubbleChartPageData,
    getPovertyBubbleChartPageData,
    getCountryProfilePageData,
    getUnbundlingOdaPageData,
    getUnbundlingOOfPageData,
    getWhereThePoorPageData,
    get,
};

export default cms;

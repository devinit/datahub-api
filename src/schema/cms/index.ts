import {getGlobalPicturePageData} from './modules/globalPicture';
import {getCountryProfilePageData} from './modules/countryProfile';
import {get} from './connector';

const cms = {
    getGlobalPicturePageData,
    getCountryProfilePageData,
    get,
};

export default cms;

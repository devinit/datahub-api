import {getGlobalPicturePageData, getGlobalPictureThemes} from './modules/globalPicture';
import {getCountryProfilePageData} from './modules/countryProfile';
import {get} from './connector';

const cms = {
    getGlobalPicturePageData,
    getGlobalPictureThemes,
    getCountryProfilePageData,
    get,
};

export default cms;

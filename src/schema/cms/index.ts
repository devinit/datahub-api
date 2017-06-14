import global from './modules/global';
import globalPicture from './modules/globalPicture';

export interface Icms {
    global;
    globalPicture;
}
const cms: Icms = {
    global,
    globalPicture
};

export default cms;

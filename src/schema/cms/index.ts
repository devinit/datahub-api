import global from './modules/global';
import globalPicture from './modules/globalPicture';

export interface ICms {
    global;
    globalPicture;
}
const cms: ICms = {
    global,
    globalPicture
};

export default cms;

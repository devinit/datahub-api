
import refs, {IRefs} from '../modules/refs';
import dw, {IDW} from '../modules/dw';

export interface IContext {
    modules: {refs: IRefs} & IDW;
}

export default [...refs, ...dw];

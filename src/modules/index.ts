
import {IRefs} from '../modules/refs';
import {IDW} from '../modules/dw';

export interface IContext {
    modules: {refs: IRefs} & IDW;
}

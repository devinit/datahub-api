import * as R from 'ramda';
import {getPageData} from '../page';

export const getUnbundlingOOfPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oof');

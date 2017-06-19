import * as R from 'ramda';
import {getPageData} from '../page';

export const getUnbundlingOdaPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oda');

import * as R from 'ramda';
import {getPageData} from '../page';

export const getWhereThePoorPageData = (): Promise<DH.IPage[]> => getPageData('where-the-poor');
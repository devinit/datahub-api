import * as R from 'ramda';
import {getPageData} from '../page';

export const getSpotlightUgandaPageData = (): Promise<DH.IPage[]> => getPageData('spotlight-uganda');

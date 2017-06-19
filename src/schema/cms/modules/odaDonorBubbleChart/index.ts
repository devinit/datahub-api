import * as R from 'ramda';
import {getPageData} from '../page';

export const getOdaDonorBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('oda-donor-bubble-chart');

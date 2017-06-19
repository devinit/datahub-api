import * as R from 'ramda';
import {getPageData} from '../page';

export const getPovertyBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('poverty-bubble-chart');

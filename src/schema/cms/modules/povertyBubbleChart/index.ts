import {getPageData} from '../page';

export const getPovertyBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('bubble-chart-poverty');

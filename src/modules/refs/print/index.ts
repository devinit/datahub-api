import { githubGet } from '../../../api/github';

export const getPrintPageData = (slug: string, fileName: string): Promise <DH.IPage[]> => {
  const endPoint = `country-profile/print/${slug}/${fileName}.csv`;

  return githubGet<DH.IPage>(endPoint);
};

export const getPrintNarrative = (country: string): Promise<DH.IPage[]> => getPrintPageData(country, 'narrative');

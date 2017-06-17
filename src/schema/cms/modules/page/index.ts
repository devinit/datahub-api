import {get} from '../../connector';

export const getPageData = (moduleName: string): Promise <DH.IPage[]> => {
    const endPoint: string = `${moduleName}/page.csv`;
    return get<DH.IPage>(endPoint);
};

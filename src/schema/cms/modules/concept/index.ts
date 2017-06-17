import {get} from '../../connector';

export interface IConcept {
    id: string;
    theme: string;
    name: string;
    description: string;
    uom: string;
    uomDisplay: string;
    startYear: number;
    endYear: number;
}

export const getConceptData = (moduleName: string): Promise <IConcept[]> => {
    const endPoint: string = `${moduleName}/concept.csv`;
    return get<IConcept>(endPoint);
};

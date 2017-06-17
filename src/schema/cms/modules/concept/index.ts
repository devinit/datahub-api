import {get} from '../../connector';

export const getConceptData = (moduleName: string): Promise <DH.IConcept[]> => {
    const endPoint: string = `${moduleName}/concept.csv`;
    return get<DH.IConcept>(endPoint);
};

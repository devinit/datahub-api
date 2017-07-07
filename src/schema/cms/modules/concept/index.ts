import {get} from '../../connector';
import * as R from 'ramda';

export interface IConcept {
    id: string;
    theme: string;
    name: string;
    description: string;
    uom: string;
    uom_display: string;
    start_year: number;
    include_in_methodology_page: number;
    color: string;
    end_year: number;
    heading: string;
    source: string;
    source_link: string;
    appear_in_bubble_chart: number;
}
// TODO: parse start_year as a number
export const getConcepts = (moduleName: string): Promise <IConcept[]> => {
    const endPoint: string = `${moduleName}/concept.csv`;
    return get<IConcept>(endPoint);
};

export const getConceptAsync = async (moduleName: string, id: string, theme?: string): Promise <IConcept> => {
    const allConcepts: IConcept[]  = await getConcepts(moduleName);
    const concepts: IConcept[] = allConcepts.filter(obj => obj.id === id);
    if (!concepts[0]) throw new Error(`failed to get concept for ${moduleName} ID: ${id}`);
    if (theme) {
       const concept: IConcept | undefined =  concepts.find(obj => obj.theme === theme);
       if (!concept) throw new Error(`failed to get concept for ${moduleName} id: ${id} theme: ${theme}`);
       return concept;
    }
    return concepts[0];
};

export const getConcept = (id: string, concepts: IConcept[]): IConcept =>
    R.find(R.propEq('id', id), concepts) as IConcept;

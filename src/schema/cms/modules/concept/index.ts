import {get} from '../../connector';
export interface IConcept {
    id: string;
    theme: string;
    name: string;
    description: string;
    uom: string;
    uom_display: string;
    map_style?: string;
    is_high_better?: number;
    start_year: number;
    tooltip: string;
    dac_only: number;
    default_year: number;
    include_in_methodology_page: number;
    color?: string;
    position?: string;
    end_year: number;
    range?: string;
    heading: string;
    methodology?: string;
    source: string;
    source_link: string;
    appear_in_bubble_chart: number;
}

export const getConcepts = (moduleName: string): Promise <IConcept[]> => {
    const endPoint: string = `${moduleName}/concept.csv`;
    return get<IConcept>(endPoint);
};

export const getMethodologyData = async (moduleName: string): Promise <IConcept[]> => {
    const allConcepts: IConcept[] = await getConcepts(moduleName);
    return allConcepts.filter(obj => obj.include_in_methodology_page === 1);
};
export const getConceptAsync = async (moduleName: string, id: string, theme?: string): Promise <IConcept> => {
    const allConcepts: IConcept[]  = await getConcepts(moduleName);
    const concepts: IConcept[] = allConcepts.filter(obj => obj.id === id.trim());
    if (!concepts[0]) throw new Error(`failed to get concept for ${moduleName} ID: ${id}`);
    if (theme) {
       const concept: IConcept | undefined =  concepts.find(obj => obj.theme === theme);
       if (!concept) throw new Error(`failed to get concept for ${moduleName} id: ${id} theme: ${theme}`);
       return concept;
    }
    return concepts[0];
};

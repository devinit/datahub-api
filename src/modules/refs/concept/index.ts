import { githubGet } from '../../../api/github';
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
  include_in_methodology: number;
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

export const getConcepts = (moduleName: string): Promise<IConcept[]> => {
  const endPoint = `${moduleName}/concept.csv`;

  return githubGet<IConcept>(endPoint);
};

const methodologyDownloadsMap = {
  'data_series.percent_in_p20_national': 'poorest-20-percent'
};

export const getMethodologyData = async (moduleName: string): Promise <DH.IMethodology[]> => {
  const allConcepts: IConcept[] = await getConcepts(moduleName);

  return allConcepts
    .filter(obj => obj.include_in_methodology === 1)
    .map((obj: IConcept) => {
      const source = { name: obj.source, link: obj.source_link };
      let oldId = obj.id.split('.')[1].replace(/_/g, '-');
      if (methodologyDownloadsMap[obj.id]) { oldId = methodologyDownloadsMap[obj.id]; }
      const csv = `http://212.111.41.68:8000/single_table?indicator=${oldId.replace(/-/g, '_')}&format=csv`;
      const zip = `https://github.com/devinit/digital-platform/blob/master/user-data/${oldId}.zip?raw=true`;
      const methodology = obj.methodology || '';

      return { ...obj, methodology, source, csv, zip };
    });
};

export const getConceptAsync = async (moduleName: string, id: string, theme?: string): Promise <IConcept> => {
  const allConcepts: IConcept[] = await getConcepts(moduleName);
  const concepts: IConcept[] = allConcepts.filter(obj => obj.id === id.trim());
  if (!concepts[0]) { throw new Error(`failed to githubGet concept for ${moduleName} ID: ${id}`); }
  if (theme) {
    const concept: IConcept | undefined = concepts.find(obj => obj.theme === theme);
    if (!concept) {
      throw new Error(`failed to githubGet concept for ${moduleName} id: ${id} theme: ${theme}`);
    }

    return concept;
  }

  return concepts[0];
};

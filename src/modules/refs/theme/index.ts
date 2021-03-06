import { githubGet } from '../../../api/github';
import { IConcept, getConcepts } from '../concept';

export interface IRawTheme {
    id: string;
    name: string;
    default_indicator: string;
    position: number;
}

export const getThemes = async (themesType: string): Promise<DH.ITheme[]> => {
    const concepts: IConcept[] = await getConcepts(themesType);
    const themes: IRawTheme[] = await githubGet<IRawTheme>(`${themesType}/theme.csv`);
    return themes
        .map(theme => {
            const indicators = concepts
                .filter(concept => concept.theme === theme.id)
                .sort((a, b) => Number(a.position) - Number(b.position))
                .map(obj => ({id: obj.id, name: obj.name, tooltip: obj.tooltip,
                    heading: obj.description, source: obj.source}));
            return { ...theme, indicators };
        })
        .sort((a, b) => a.position - b.position);
};

export const getGlobalPictureThemes = async (): Promise<DH.ITheme[]> => getThemes('global-picture');
export const getSpotlightThemes = async (country): Promise<DH.ITheme[]> => getThemes(`spotlight-${country}`);

import {get} from '../../connector';
import {getConcepts, IConcept} from '../concept';

export interface IRawTheme {
    id: string;
    name: string;
    default_indicator: string;
    position: string;
}

export const getThemes = async (themesType: string): Promise<DH.ITheme[]> => {
    const concepts: IConcept[] = await getConcepts(themesType);
    const themes: IRawTheme[] = await get<IRawTheme>(`${themesType}/theme.csv`);
    return themes
        .map(theme => {
            const indicators = concepts
                .filter(concept => concept.theme === theme.id)
                .sort((a, b) => Number(a.position) - Number(b.position))
                .map(obj => ({id: obj.id, name: obj.name}));
            const position = Number(theme.position);
            return {...theme, position, indicators};
        })
        .sort((a, b) => a.position - b.position);
};

export const getGlobalPictureThemes = async (): Promise<DH.ITheme[]> => getThemes('global-picture');
export const getSpotlightThemes = async (country): Promise<DH.ITheme[]> => getThemes(`spotlight-${country}`);

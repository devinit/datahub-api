import {get} from '../../connector';

export interface IRawTheme {
    id: string;
    name: string;
    default_indicator: string;
    position: string;
}
export const getThemes = async (themesType: string): Promise<DH.ITheme[]> => {
    const themes: IRawTheme[] = await get<IRawTheme>(`${themesType}/theme.csv`);
    return themes.map(obj => ({...obj, position: Number(obj.position)}))
                .sort((a, b) => a.position - b.position);
};

export const getGlobalPictureThemes = async (): Promise<DH.ITheme[]> => getThemes('global-picture');
export const getSpotlightThemes = async (country): Promise<DH.ITheme[]> => getThemes(`spotlight-${country}`);

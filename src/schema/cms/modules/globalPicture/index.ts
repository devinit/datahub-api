import {get} from '../../connector';
import * as R from 'ramda';

interface ITheme {
    id: string;
    name: string;
    default: string;
    order: number;
}

export const getThemes = async (): Promise<ITheme[]> => get<ITheme>('global-picture/themes.csv');

export const getTheme = async (id: string): Promise<ITheme> =>
    R.pipeP(getThemes, R.find(R.propEq('id', id)))();

interface IglobalPicture {
    getTheme: any;
    getThemes: any;
}

const globalPicture: IglobalPicture = {
    getTheme,
    getThemes
};
export default globalPicture;

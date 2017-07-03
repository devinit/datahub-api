import {get} from '../../connector';
import * as R from 'ramda';

export interface IEntityBasic {
    id: string;
    color?: string;
    name: string;
}
export interface ICurrency {
    code: string;
    id: string;
    name: string;
}
export interface IEntity extends IEntityBasic {
    type: string;
    slug: string;
    id: string;
    name: string;
    region: string;
    donorRecipientType: string;
}
export interface IRegional extends IEntityBasic {
    dacContinentCode: string;
    dacId: string;
    dacContinent: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

// TODO: refactor so that it returns Error if entity is not found
export const getEntityById = (id: string, entities: IEntity[]): IEntity =>
    R.find(R.propEq('id', id), entities) as IEntity;

export const getEntityBySlugAsync = async (slug: string): Promise<IEntity> => {
     const entities: IEntity[] = await getEntities();
     return R.find(R.propEq('slug', slug), entities) as IEntity;
};

export const getEntityByIdAsync = async (id: string): Promise<IEntity> => {
    const entities: IEntity[] = await getEntities();
    return R.find(R.propEq('id', id), entities) as IEntity;
};

export const getSectors = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/sector.csv');
export const getChannels = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/channel.csv');
export const getBundles = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/bundle.csv');
export const getRegional = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/regional.csv');
export const getCurrency = (): Promise<ICurrency[]> => get<IEntityBasic>('global/currency.csv');
export const getColors = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/colors.csv');

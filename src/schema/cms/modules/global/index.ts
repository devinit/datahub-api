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
    income_group: string;
    donor_recipient_type: string;
}
export interface IRegional extends IEntityBasic {
    dac_continent_code: string;
    dac_id: string;
    dac_continent: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

// TODO: refactor so that it throws an error if entity is not found
export const getEntityById = (id: string, entities: IEntity[]): IEntity =>
    R.find(R.propEq('id', id), entities) as IEntity;

export const getEntityBySlugAsync = async (slug: string): Promise<IEntity | undefined> => {
     const entities: IEntity[] = await getEntities();
     return entities.find(obj => obj.slug === slug);
};

export const getEntityByIdAsync = async (id: string): Promise<IEntity> => {
    const entities: IEntity[] = await getEntities();
    const entity =  R.find(R.propEq('id', id), entities);
    if (!entity) throw new Error(`failed to get entity for ${id}`);
    return entity as IEntity;
};

export const getCountries = async (): Promise<DH.IIdNamePair[]> => {
    const entities = await getEntities();
    return entities
        .filter(entity => entity.type === 'country')
        .map(entity => ({id: entity.slug, name: entity.name}));
};

// TODO: refactor so that it throws Error
export const getEntityByIdGeneric = <T extends {id: string}>(id: string, entities: T[]): T | undefined =>
    entities.find(obj => obj.id === id);

export const getSectors = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/sector.csv');
export const getChannels = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/channel.csv');
export const getBundles = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/bundle.csv');
export const getRegional = (): Promise<IRegional[]> => get<IRegional>('global/regional.csv');
export const getCurrency = (): Promise<ICurrency[]> => get<ICurrency>('global/currency.csv');
export const getColors = (): Promise<IEntityBasic[]> => get<IEntityBasic>('global/colors.csv');

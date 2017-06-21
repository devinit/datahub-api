import * as R from 'ramda';
import {IEntity, getEntityById, getEntities} from '../schema/cms/modules/global';

export interface Isummable {
    value: number | null;
}

export interface IhasDiId {
    di_id: string;
}

export interface IhasId {
    id: string;
}

export interface IhasStringValue {
    value: string | null;
}

export const getCurrentYear = (): number => {
    const date = new Date();
    return date.getFullYear();
};

const parse = (value: string | null): number | null => value && value.length ? Number(value) : null;

export const addCountryName = (obj: IhasId, entites: IEntity[]): any => {
    const entity = getEntityById(obj.id, entites);
    return {...obj, countryName: entity.name};
};

export const indicatorDataProcessing = async (data: IhasDiId[]): Promise<DH.IMapUnit[]> => {
    const entities = await getEntities();
    return data
            .map(toId)
            .map((obj) => addCountryName(obj, entities))
            .map(toNumericValue);
};

export const toNumericValue: (obj: IhasStringValue) => any =
    (obj) => ({...obj, value: parse(obj.value)});

export const toId: (obj: IhasDiId ) => any = (obj) => {
    const id = obj.di_id;
    const newObj = R.omit(['di_id'], obj);
    return {...newObj, id };
};

export const getTotal = (data: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += obj.value;
        return sum;
    }, 0, data);

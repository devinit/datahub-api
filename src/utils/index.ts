import * as R from 'ramda';
import {IEntity, getEntityById} from '../schema/cms/modules/global';
import * as LRU from 'lru-cache';
import * as fs from 'fs-extra';

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

const CACHE_DELAY: number = process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 : 1000 * 60;
export const MAX_AGE: number =  1000 * 60 * 60 * 60;

export const writeKeyToFile = (key: string, cacheType: string): Promise<void> =>
    fs.appendFile('src/lib/cache/cache.json', `${key} ${cacheType}\n`);

export const queue: (key: string, cacheType: string, cache: LRU.Cache<any>, cb: (string) => Promise<any>) =>
    Promise<boolean> = async (key, cacheType, cache, cb) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const data = await cb(key);
                    cache.set(key, data);
                    writeKeyToFile(key, cacheType);
                    resolve(true);
                } catch (error) {
                    if (error) console.error(error);
                    reject(false);
                }
            }, CACHE_DELAY);
        });
    };

export const getCurrentYear = (): number => {
    const date = new Date();
    return date.getFullYear();
};

const parse = (value: string | null): number | null => value && value.length ? Number(value) : null;

export const addCountryName = (obj: IhasId, entites: IEntity[]): any => {
    const entity = getEntityById(obj.id, entites);
    return {...obj, countryName: entity.name};
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

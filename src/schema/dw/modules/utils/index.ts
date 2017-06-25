import {IDatabase} from 'pg-promise';
import * as R from 'ramda';
import {IExtensions} from '../../db';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {IEntity, getEntityById, getEntities, getEntityByIdAsync} from '../../../cms/modules/global';
import {isNumber} from '../../../../lib/isType';

export interface IGetIndicatorArgs {
    id: string;
    table: string;
    query: string;
    theme?: string;
    db: IDatabase<IExtensions> & IExtensions;
}
export interface IRAWPopulationGroup {
    di_id: string;
    value_rural: string;
    value_urban: string;
    year: string;
}
export interface IRAWPopulationAgeBand {
    di_id: string;
    value_0_14: string;
    value_15_64: string;
    value_65_and_above: string;
    year: string;
}
interface ISqlSimple {
    indicator: string;
    indicatorRange: string;
}
interface IGetIndicatorArgsSimple {
    id: string; // table
    startYear: number;
    endYear: number;
    sql: ISqlSimple;
    db: IDatabase<IExtensions> & IExtensions;
}
export interface IRAW {
    di_id: string;
    value: string;
    year: string;
}
export interface IRAWQuintile {
    value_bottom_20pc: string;
    value_2nd_quintile: string;
    value_3rd_quintile: string;
    value_4th_quintile: string;
    value_5th_quintile: string;
}
export const RECIPIENT = 'recipient';
export const DONOR = 'donor';

export interface Isummable {
    value: number | string | null;
}

export interface IhasDiId {
    di_id: string;
}

export interface IhasId {
    id: string | null;
}
export const toNumericValue: (obj) => any =
    (obj) => ({...obj, value: Number(obj.value), year: Number(obj.year)});

export const toId: (obj: IhasDiId ) => any = (obj) => {
    const id = obj.di_id;
    const newObj = R.omit(['di_id'], obj);
    return {...newObj, id };
};

export const getTotal = (data: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += Number(obj.value);
        return sum;
    }, 0, data);

export async function getIndicatorData<T>({db, table, query, id, theme}: IGetIndicatorArgs): Promise<T[]> {
    const concept: IConcept = await getConceptAsync('country-profile', table, theme);
    const queryArgs = {...concept, id};
    return db.manyCacheable(query, queryArgs);
}
export const getIndicatorDataSimple =
    async ({id, startYear, endYear, sql, db}: IGetIndicatorArgsSimple): Promise<IRAW[]> => {
        const query = !isNumber(endYear) ? sql.indicator : sql.indicatorRange;
        return db.manyCacheable(query, {id, startYear, endYear});
};

export const addCountryName = (obj: IhasId, entites: IEntity[]): any => {
    if (obj.id === null) return obj;
    const entity = getEntityById(obj.id, entites);
    return {...obj, countryName: entity.name};
};

export const indicatorDataProcessing = async (data: IhasDiId[]): Promise<DH.IMapUnit[]> => {
    const entities: IEntity[] = await getEntities();
    const processed = indicatorDataProcessingSimple(data) as IhasId[];
    return processed.map((obj) => addCountryName(obj, entities));
};

export const indicatorDataProcessingSimple = <T extends {}>(data: IhasDiId[]): T[] => {
    return data
            .map(toId)
            .map(toNumericValue);
};
export const isDonor = async (id: string): Promise<boolean>  => {
    const {donorRecipientType}: IEntity = await getEntityByIdAsync(id);
    if (donorRecipientType === DONOR) return true;
    return false;
};

export const normalizeKeyName = (columnName: string): string => {
    const str = columnName.split(/value\_/)[1];
    return str.replace(/\_/g, '-');
};

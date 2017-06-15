import * as R from 'ramda';

export interface Isummable {
    value: number | null;
}

export interface IhasDiId {
    di_id: string | null;
}

export interface IhasStringValue {
    value: string | null;
}

export const getCurrentYear = (): number => {
    const date = new Date();
    return date.getFullYear();
};

const parse = (value: string | null): number | null => value && value.length ? Number(value) : null;

export const toNumericValue: (data: any[]) => any[] =
    R.map((obj: IhasStringValue) => Object.assign(obj, {value: parse(obj.value) }));

export const toId: (data: any[] ) => any[] =
    R.map((obj: IhasDiId) => {
        const id = obj.di_id;
        R.omit(['di_id'], obj);
        return Object.assign({}, obj, { id });
    });

export const getTotal = (data: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += obj.value;
        return sum;
    }, 0, data);


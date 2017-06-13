import * as R from 'ramda';

export const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
};

export interface Isummable {
    value: number | null;
}

export interface IhasdiId {
    di_id: string | null;
}

export interface IhasId {
    id: string | null;
}

export const toId: (data: IhasdiId[] ) => IhasId[] =
    R.map((obj: IhasdiId) => {
        const id = obj.di_id;
        R.omit(['di_id'], obj);
        return Object.assign({}, obj, { id });
    });

export const getTotal = (data: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += obj.value;
        return sum;
    }, 0, data);

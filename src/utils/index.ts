import * as R from 'ramda';

export const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
};

export interface Isummable {
    value: number | null;
}
export const getTotal = (mapData: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += obj.value;
        return sum;
    }, 0, mapData);

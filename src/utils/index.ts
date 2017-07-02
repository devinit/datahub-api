export const getCurrentYear = (): number => {
    const date = new Date();
    return date.getFullYear();
};

export const parse = (value: string | null): number | null => value && value.length ? Number(value) : null;

export const formatNumbers = (value: number | string | undefined | null, precision: number = 0): string => {
    if (value === undefined || value === null) return 'No data';
    const val = Number(value);
    const absValue = Math.abs(val);
    if (absValue < 1e6) {
        const newValue = val / 1e3;
        return `${newValue.toFixed(precision)}k`;
    } else if (absValue >= 1e6 && absValue < 1e9) {
        const newValue = val / 1e6;
        return `${newValue.toFixed(precision)}m`;
    } else {
        const newValue = val / 1e9;
        return `${newValue.toFixed(precision)}bn`;
    }
};

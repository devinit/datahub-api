export const getCurrentYear = (): number => {
    const date = new Date();
    return date.getFullYear();
};

export const parse = (value: string | null): number | null => value && value.length ? Number(value) : null;

export const formatNumbers = (value: number, precision: number = 0): string => {
    const absValue = Math.abs(value);
    if (absValue < 1e6) {
        const newValue = value / 1e3;
        return `${newValue.toFixed(precision)}k`;
    } else if (absValue >= 1e6 && absValue < 1e9) {
        const newValue = value / 1e6;
        return `${newValue.toFixed(precision)}m`;
    } else {
        const newValue = value / 1e9;
        return `${newValue.toFixed(precision)}bn`;
    }
};

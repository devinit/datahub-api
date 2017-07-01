export default {
    indicatorRange: 'SELECT * FROM ${table} WHERE year >= ${startYear} AND year <= ${endYear}',
    indicator: 'SELECT * FROM ${table} WHERE year = ${startYear}'
};

export const DAC = 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';

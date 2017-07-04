export default {
    indicatorRange: 'SELECT * FROM ${table} WHERE year >= ${start_year} AND year <= ${end_year}',
    indicator: 'SELECT * FROM ${table} WHERE year = ${start_year}'
};

export const DAC = 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';

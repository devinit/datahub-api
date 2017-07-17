export default {
    indicatorRange: 'SELECT * FROM ${table^} WHERE year >= ${start_year} AND year <= ${end_year} AND value IS NOT NULL',
    indicator: 'SELECT * FROM ${table^} WHERE year = ${start_year} AND value IS NOT NULL'
};

export const DAC = 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';
export const dataRevolution = 'SELECT * FROM ${table^} WHERE detail IS NOT NULL';

export default {
    indicatorRange: 'SELECT * FROM ${id^} WHERE year >= ${startYear} AND year <= ${endYear}',
    indicator: 'SELECT * FROM ${id^} WHERE year = ${startYear}'
};

export const DAC = 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';

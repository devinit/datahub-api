export default {
    indicatorRange: 'SELECT * FROM data_series.${id^} WHERE year >= ${startYear} AND year <= ${endYear}',
    indicator: 'SELECT * FROM data_series.${id^} WHERE year >= ${startYear}',
    DAC: 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1'
};

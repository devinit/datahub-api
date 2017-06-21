export default {
    indicator: 'SELECT * FROM data_series.${id^} WHERE year >= ${startYear} AND year <= ${endYear}',
    DAC: 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1'
};

export default {
    indicatorRange: 'SELECT * FROM oda WHERE year >= ${startYear} AND year <= ${endYear}',
    indicator: 'SELECT * FROM ${id^} WHERE year = ${startYear}'
};

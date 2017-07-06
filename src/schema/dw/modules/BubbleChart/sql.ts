export default {
    // tslint:disable-next-line:max-line-length
    govtRevenuePerPerson: 'select * FROM data_series.non_grant_revenue_ppp_pc WHERE year >= ${start_year} AND year <= ${end_year} ',
    // tslint:disable-next-line:max-line-length
    percentageInExtremePoverty: 'select di_id as id, year, value_2 as value, di_id FROM data_series.poverty_190  WHERE value_2 > 0 AND year >= ${start_year} AND year <= ${end_year} ',
    numberInExtremePoverty: 'select di_id as id, year, value FROM data_series.poor_people_190 WHERE value > 0 AND year >= ${start_year} AND year <= ${end_year} ',
    odaFrom: 'Select from_di_id FROM fact.oda_2015 WHERE value > 0 GROUP BY from_di_id',
    // odaTo: 'Select to_di_id From fact.\'oda_2015\' GROUP BY From_di_id',
     // bubulesize data
    indicator: 'SELECT * FROM ${table^} WHERE year >= ${start_year} AND year <= ${end_year}'
};

export default {
    // tslint:disable-next-line:max-line-length
    govtRevenuePerPerson: 'select * From data_series.non_grant_revenue_ppp_pc WHERE di_id=${id} AND year >= ${start_year} AND year <= ${end_year} ',
    // tslint:disable-next-line:max-line-length
    percentageInExtremePoverty: 'select * From data_series.poverty_190 WHERE di_id=${id} AND year >= ${start_year} AND year <= ${end_year} ',
    numberInExtremePoverty: 'select * From data_series.poverty_190 WHERE di_id=${id} AND year >= ${start_year} AND year <= ${end_year} ',
    odaFrom: 'Select from_di_id From fact.\'oda_2015\' GROUP BY From_di_id',
    // odaTo: 'Select to_di_id From fact.\'oda_2015\' GROUP BY From_di_id',
     // bubulesize data
    indicator: 'SELECT * FROM ${table^} WHERE year >= ${start_year} AND year <= ${end_year}'
};

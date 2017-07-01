export default {
    // tslint:disable-next-line:max-line-length
    govtRevenuePerPerson: 'select * from data_series.non_grant_revenue_ppp_pc where di_id=${id} AND year >= ${startYear} AND year <= ${endYear} ',
    // tslint:disable-next-line:max-line-length
    Poverty190: 'select * from data_series.poverty_190 where di_id=${id} AND year >= ${startYear} AND year <= ${endYear} ',
    // bubulesize data
    indicator: 'select * from ${^table} where di_id=${id} AND year >= ${startYear} AND year <= ${endYear} ',
    odaEntityList: 'Select from_di_id from fact.\'oda_2015\' GROUP BY from_di_id',
    // tslint:disable-next-line:max-line-length
    oda: 'SELECT to_di_id, year,  ROUND\(SUM\(value\), 2\) AS value FROM fact.\'oda_2015\' WHERE from_di_id = ${id} AND year >= ${startYear} AND year <= ${endYear} GROUP BY to_di_id, year ORDER BY year DESC, to_di_id'
};

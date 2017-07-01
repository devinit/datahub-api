export default {
    govtRevenuePerPerson: '',
    Poverty190: '',
    // tslint:disable-next-line:max-line-length
    oda: 'SELECT to_di_id, year, ROUND\(SUM\(value\), 2\) AS value FROM fact.\'oda_2015\' WHERE from_di_id = ${id} GROUP BY to_di_id, year ORDER BY year DESC, to_di_id'
};

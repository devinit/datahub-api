export default {
    population: 'SELECT value FROM fact.population_total WHERE di_id = ${id} AND year = ${startYear}',
    // tslint:disable-next-line:max-line-length
    domesticPublicResources: 'SELECT value FROM data_series.domestic WHERE di_id =${id} AND budget_type = \'actual\' AND year = ${startYear} AND l1 = \'total-revenue-and-grants\' AND l2 = \'revenue\' AND l3 is NULL',
    // tslint:disable-next-line:max-line-length
    internationalResources: 'SELECT value FROM data_series.intl_flows_recipients WHERE di_id = ${id} AND year = ${startYear} AND direction =\'in\'',
    governmentSpendPerPerson: 'SELECT value FROM data_series.govt_spend_pc WHERE di_id = ${id} AND year = ${startYear}',
    poorestPeople: 'SELECT value FROM data_series.poorest_20_percent WHERE di_id = ${id} AND year = ${startYear}',
    // tslint:disable-next-line:max-line-length
    averageIncomerPerPerson: 'SELECT value, year, di_id FROM fact.gni_pc_usd_2015 WHERE di_id = ${id} AND year >= ${startYear} AND year <= ${endYear}',
    incomeDistTrend: 'SELECT * FROM fact.income_share_by_quintile WHERE di_id = ${id} AND year >= ${startYear}'
};

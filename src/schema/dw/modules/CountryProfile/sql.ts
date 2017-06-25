export default {
    population: 'SELECT value FROM fact.population_total WHERE di_id = ${id} AND year = ${startYear}',
    // tslint:disable-next-line:max-line-length
    domesticPublicResources: 'SELECT value FROM data_series.domestic WHERE di_id =${id} AND budget_type = \'actual\' AND year = ${startYear} AND l1 = \'total-revenue-and-grants\' AND l2 = \'revenue\' AND l3 is NULL',
    // tslint:disable-next-line:max-line-length
    internationalResources: 'SELECT value FROM data_series.intl_flows_recipients WHERE di_id = ${id} AND year = ${startYear} AND direction =\'in\'',
    governmentSpendPerPerson: 'SELECT value FROM data_series.govt_spend_pc WHERE di_id = ${id} AND year = ${startYear}',
    poorestPeople: 'SELECT value FROM data_series.poorest_20_percent WHERE di_id = ${id} AND year = ${startYear}',
    // tslint:disable-next-line:max-line-length
    averageIncomerPerPerson: 'SELECT * FROM fact.gni_pc_usd_2015 WHERE di_id = ${id} AND year >= ${startYear} AND year <= ${endYear}',
    incomeDistTrend: 'SELECT value_bottom_20pc, value_2nd_quintile, value_3rd_quintile, value_4th_quintile, value_5th_quintile FROM fact.income_share_by_quintile WHERE di_id = ${id} AND year >= ${startYear} ORDER BY year',
    // tslint:disable-next-line:max-line-length
    populationDistribution: 'SELECT * FROM fact.population_rural_urban WHERE di_id = ${id} AND year >= ${startYear} AND year <= ${endYear}',
    populationPerAgeBand: 'SELECT * FROM fact.population_by_age WHERE di_id = ${id} AND year >= ${startYear} AND year <= ${endYear}',
};

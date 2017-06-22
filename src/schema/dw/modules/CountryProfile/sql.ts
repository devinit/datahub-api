export default {
    population: 'SELECT value FROM fact.population_total WHERE di_id = ${id} AND year = ${startYear}',
    domesticPublicResources: 'SELECT value FROM data_series.domestic WHERE id = ${id} AND year = ${startYear}',
    // tslint:disable-next-line:max-line-length
    internationalResources: 'SELECT value FROM data_series.intl_flows_recipients WHERE id = ${id} AND year = ${startYear} AND direction = ${direction}',
    governmentSpendPerPerson: 'SELECT value FROM data_series.govt_spend_pc WHERE di_id = ${id} AND year = ${startYear}',
    poorestPeople: 'SELECT value FROM data_series.poorest_20_percent WHERE di_id = ${id} AND year = ${startYear}',
};

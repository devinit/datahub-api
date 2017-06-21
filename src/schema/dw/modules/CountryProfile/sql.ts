export default {
    population: 'SELECT value FROM fact.population_total WHERE di_id = ${id} AND year = ${startYear}',
    domesticPublicResources: 'SELECT * FROM domestic WHERE di_id = ${id} AND year = ${startYear}',
    internationalResources: 'SELECT * FROM intl_flows_recipients WHERE di_id = $1',
    governmentSpendPerPerson: 'SELECT * FROM govt_spend_pc WHERE di_id = ${id} AND year = ${startYear}',
};

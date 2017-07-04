export default {
    // tslint:disable-next-line:max-line-length
    poorestPeople: 'select * from ${schema^}.${country^}_poverty_headcount where district_id = ${id} and year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    localGovernmentSpendPerPerson: 'select * from ${schema^}.${country^}_gov_spend_pp district_id = ${id} and year = ${start_year}',
    stdOfLiving: 'select * from ${schema^}.${country^}_deprivation_living district_id = ${id} and year = ${start_year}',
    lifeExpectancy: 'select * from ${schema^}.${country^}_life_expectancy district_id = ${id} and year = ${start_year}',
    totalPopulation: 'select * from ${schema^}.${country^}_total_pop district_id = ${id} and year = ${start_year}',
    populationDensity: 'select * from ${schema^}.${country^}_pop_dens district_id = ${id} and year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    populationDistribution: 'select * from ${schema^}.${country^}_urban_rural_pop district_id = ${id} and year = ${start_year}',
    averageDependencyRatio: 'select * from ${schema^}.${country^}_dependency_ratio district_id = ${id} and year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    allAverageDependencyRatio: 'select AVG(value) from ${schema^}.${country^}_dependency_ratio where year = ${start_year}',
    pupilTeacherRatioGovtSchl: 'SELECT value FROM ${schema^}.${country^}_primary_stu_teach_ratio_gov WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    pupilTeacherRatioOtherSchl: 'SELECT value FROM ${schema^}.${country^}_primary_stu_teach_ratio WHERE district_id =${id} AND year = ${start_year}',
    studentsPass: 'SELECT value FROM ${schema^}.${country^}_exam_perf_rate WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    primaryEducationfunding: 'SELECT value FROM ${schema^}.${country^}_primary_educ_funding WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    districtHealthPerformance: 'SELECT value FROM ${schema^}.${country^}_overall_health WHERE district_id =${id} AND year = ${start_year}',
    treatmeantOfTb: 'SELECT value FROM ${schema^}.${country^}_tb_success WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    healthCareFunding: 'SELECT value FROM ${schema^}.${country^}_health_funding WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    lGFResources: 'SELECT value FROM ${schema^}.${country^}_igf_resources WHERE district_id =${id} AND year = ${start_year}',
    crResources: 'SELECT value FROM ${schema^}.${country^}_central_resources WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    dResources: 'SELECT value FROM ${schema^}.${country^}_donor_resources WHERE district_id = ${id} AND year = ${start_year}',
    localGovernmentFinance: 'SELECT * FROM ${schema^}.${country^}_finance WHERE district_id = ${id} AND l1 = ${l1} AND year >= ${start_year} AND year <= ${end_year}'
};

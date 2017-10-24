/* tslint:disable */
export default {
    // tslint:disable-next-line:max-line-length
    poorestPeople: 'SELECT * FROM ${schema^}_2017.${country^}_poverty_headcount WHERE district_id = ${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    localGovernmentSpendPerPerson: 'SELECT * FROM ${schema^}_2017.${country^}_gov_spend_pp WHERE district_id = ${id} AND year = ${start_year}',
    stdOfLiving: 'SELECT * FROM ${schema^}_2017.${country^}_deprivation_living WHERE district_id = ${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    lifeExpectancy: 'SELECT * FROM ${schema^}_2017.${country^}_life_expectancy WHERE district_id = ${id} AND year = ${start_year}',
    totalPopulation: 'SELECT * FROM ${schema^}_2017.${country^}_total_pop WHERE district_id = ${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    populationDensity: 'SELECT * FROM ${schema^}_2017.${country^}_pop_dens WHERE district_id = ${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    populationDistribution: 'SELECT * FROM ${schema^}_2017.${country^}_population_rural_urban WHERE district_id = ${id} AND year >= ${start_year} AND year <= ${end_year}',
    averageDependencyRatio: 'SELECT * FROM ${schema^}_2017.${country^}_dependency_ratio WHERE district_id = ${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    allAverageDependencyRatio: 'SELECT AVG(value) as value FROM ${schema^}_2017.${country^}_dependency_ratio WHERE year = ${start_year}',
    pupilTeacherRatioGovtSchl: 'SELECT value FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio_gov WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    pupilTeacherRatioOtherSchl: 'SELECT value FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio WHERE district_id =${id} AND year = ${start_year}',
    studentsPassRate: 'SELECT value FROM ${schema^}_2017.${country^}_leaving_exam_perf_rate WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    studentsPassDistrictRank: 'SELECT * FROM ${schema^}_2017.${country^}_leaving_exam_perf_rate WHERE year = ${start_year} Order By value DESC',
    // tslint:disable-next-line:max-line-length
    primaryEducationfunding: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_primary_educ_funding WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    districtHealthPerformance: 'SELECT value FROM ${schema^}_2017.${country^}_overall_health WHERE district_id =${id} AND year = ${end_year}',
    districtHealthPerformanceRank: 'SELECT * FROM ${schema^}_2017.${country^}_overall_health WHERE year = ${end_year}  Order By value DESC',
    // tslint:disable-next-line:max-line-length
    treatmeantOfTb: 'SELECT value FROM ${schema^}_2017.${country^}_tb_success WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    healthCareFunding: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_health_funding WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    lGFResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_igf_resources WHERE district_id =${id} AND year = ${start_year}',
    crResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_central_resources WHERE district_id =${id} AND year = ${start_year}',
    // tslint:disable-next-line:max-line-length
    dResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_donor_resources WHERE district_id = ${id} AND year = ${start_year}',
    localGovernmentFinance: 'SELECT * FROM ${schema^}_2017.${country^}_finance WHERE district_id = ${id} AND l1 = ${l1} AND year >= ${start_year} AND value is NOT NULL'
};

// tslint:disable:max-line-length no-invalid-template-strings

export const kenya = {
    poorestPeople: 'SELECT * FROM ${schema^}_2017.${country^}_poverty_headcount WHERE district_id = ${id} AND year = ${start_year}',
    povertyGap: 'SELECT * FROM ${schema^}_2017.${country^}_poverty_gap WHERE district_id = ${id} AND year = ${start_year}',
    meanExpenditure: 'SELECT * FROM ${schema^}_2017.${country^}_poverty_meanpp_exp WHERE district_id = ${id} AND year = ${start_year}',
    healthCareFunding: 'SELECT * FROM ${schema^}_2017.${country^}_health_funding WHERE district_id = ${id} AND year = ${end_year}',
    birthAttendanceSkilled: 'SELECT * FROM ${schema^}_2017.${country^}_births_attendance WHERE district_id = ${id} AND year = ${start_year}',
    contraceptiveUse: 'SELECT * FROM ${schema^}_2017.${country^}_contraceptives WHERE district_id = ${id} AND year = ${start_year}',
    primaryPupilTeacherRatioAllSchl: 'SELECT * FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio WHERE district_id = ${id} AND year = ${start_year}',
    primaryTeacherRatioPublicSchl: 'SELECT * FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio_gov WHERE district_id = ${id} AND year = ${start_year}',
    primaryTeacherRatioPrivateSchl: 'SELECT * FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio_priv WHERE district_id = ${id} AND year = ${start_year}',
    totalPopulation: 'SELECT * FROM ${schema^}_2017.${country^}_total_pop WHERE district_id = ${id} AND year = ${end_year}',
    populationDensity: 'SELECT * FROM ${schema^}_2017.${country^}_pop_dens WHERE district_id = ${id} AND year = ${end_year}',
    populationBirthRate: 'SELECT * FROM ${schema^}_2017.${country^}_pop_birthrate WHERE district_id = ${id} AND year = ${start_year}',
    lGFResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_igf_resources WHERE district_id =${id} AND year = ${end_year}',
    crResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_central_resources WHERE district_id =${id} AND year = ${end_year}',
    dResources: 'SELECT * FROM ${schema^}_2017.${country^}_donor_resources WHERE district_id = ${id} AND year = ${end_year}',
    localGovernmentFinance: 'SELECT * FROM ${schema^}_2017.${country^}_finance WHERE district_id = ${id} AND l1 = ${l1} AND year >= ${start_year} AND value is NOT NULL',
    localGovernmentSpendPerPerson: 'SELECT * FROM ${schema^}_2017.${country^}_gov_spend_pp WHERE district_id = ${id} AND year = ${end_year}'

};
export const uganda = {
    poorestPeople: 'SELECT * FROM ${schema^}_2017.${country^}_poverty_headcount WHERE district_id = ${id} AND year = ${start_year}',
    localGovernmentSpendPerPerson: 'SELECT * FROM ${schema^}_2017.${country^}_gov_spend_pp WHERE district_id = ${id} AND year = ${end_year}',
    stdOfLiving: 'SELECT * FROM ${schema^}_2017.${country^}_deprivation_living WHERE district_id = ${id} AND year = ${start_year}',
    lifeExpectancy: 'SELECT * FROM ${schema^}_2017.${country^}_life_expectancy WHERE district_id = ${id} AND year = ${start_year}',
    totalPopulation: 'SELECT * FROM ${schema^}_2017.${country^}_total_pop WHERE district_id = ${id} AND year = ${year}',
    populationDensity: 'SELECT * FROM ${schema^}_2017.${country^}_pop_dens WHERE district_id = ${id} AND year = ${start_year}',
    populationDistribution: 'SELECT * FROM ${schema^}_2017.${country^}_population_rural_urban WHERE district_id = ${id} AND year >= ${start_year} AND year <= ${end_year}',
    averageDependencyRatio: 'SELECT * FROM ${schema^}_2017.${country^}_dependency_ratio WHERE district_id = ${id} AND year = ${start_year}',
    allAverageDependencyRatio: 'SELECT AVG(value) as value FROM ${schema^}_2017.${country^}_dependency_ratio WHERE year = ${start_year}',
    pupilTeacherRatioGovtSchl: 'SELECT value FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio_gov WHERE district_id =${id} AND year = ${end_year}',
    pupilTeacherRatioOtherSchl: 'SELECT value FROM ${schema^}_2017.${country^}_primary_stu_teach_ratio WHERE district_id =${id} AND year = ${end_year}',
    studentsPassRate: 'SELECT value FROM ${schema^}_2017.${country^}_leaving_exam_perf_rate WHERE district_id =${id} AND year = ${end_year}',
    studentsPassDistrictRank: 'SELECT * FROM ${schema^}_2017.${country^}_leaving_exam_perf_rate WHERE year = ${end_year} Order By value DESC',
    primaryEducationfunding: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_primary_educ_funding WHERE district_id =${id} AND year = ${end_year}',
    districtHealthPerformance: 'SELECT value FROM ${schema^}_2017.${country^}_overall_health WHERE district_id =${id} AND year = ${end_year}',
    districtHealthPerformanceRank: 'SELECT * FROM ${schema^}_2017.${country^}_overall_health WHERE year = ${end_year}  Order By value DESC',
    treatmeantOfTb: 'SELECT value FROM ${schema^}_2017.${country^}_tb_success WHERE district_id =${id} AND year = ${end_year}',
    healthCareFunding: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_health_funding WHERE district_id =${id} AND year = ${end_year}',
    lGFResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_igf_resources WHERE district_id =${id} AND year = ${end_year}',
    crResources: 'SELECT value, value_ncu FROM ${schema^}_2017.${country^}_central_resources WHERE district_id =${id} AND year = ${end_year}',
    dResources: 'SELECT * FROM ${schema^}_2017.${country^}_donor_resources WHERE district_id = ${id} AND year = ${end_year}',
    localGovernmentFinance: 'SELECT * FROM ${schema^}_2017.${country^}_finance WHERE district_id = ${id} AND l1 = ${l1} AND year >= ${start_year} AND value is NOT NULL'
};

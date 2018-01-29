
import {IDB} from '@devinit/graphql-next/lib/db';
import {uganda} from './sql';
import {getIndicatorsGeneric, getPopulationDistribution, getDistrictIndicatorRank,
    getLocalGovernmentFinance, GetIndicatorFn, ISpotlightArgs} from './utils';

const sql = uganda;
const country = 'uganda';

export default class Uganda {
    public getIndicatorsGeneric: GetIndicatorFn;
    public getDistrictIndicatorRank: (args: ISpotlightArgs, query: string) => Promise<DH.IIndicatorValueWithToolTip>;
    private db: IDB;
    constructor(db: IDB) {
        this.db = db;
        this.getDistrictIndicatorRank = getDistrictIndicatorRank(this.db);
        this.getIndicatorsGeneric = getIndicatorsGeneric({country, db: this.db});
    }
    // id eg uganda or kenya
    public async getPopulationTabRegional({id}): Promise<DH.IPopulationTabRegionalUg> {
        try {
            const [totalPopulation, populationDensity, averageDependencyRatio, allAverageDependencyRatio]
             = await this.getIndicatorsGeneric(id,
                [sql.totalPopulation, sql.populationDensity,
                sql.averageDependencyRatio, sql.allAverageDependencyRatio]);
            const populationDistribution = await getPopulationDistribution(this.db)({id, country});
            return {
            totalPopulation,
            populationDensity,
            populationDistribution,
            averageDependencyRatio,
            allAverageDependencyRatio
           };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getLocalGovernmentFinance({id}): Promise<DH.ILocalGovernmentFinance> {
        return getLocalGovernmentFinance(this.db)({id, country, startYear: 2013});
    }
    public async getPovertyTabRegional({id}): Promise<DH.IPovertyTabUg> {
        try {
            const [poorestPeople, lifeExpectancy, stdOfLiving] =
                await this.getIndicatorsGeneric(id, [sql.poorestPeople, sql.lifeExpectancy, sql.stdOfLiving]);
            return {
                poorestPeople,
                lifeExpectancy,
                stdOfLiving
            };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getEducationTabRegional({id}): Promise<DH.IEducationTabRegionalUg> {
         try {
            const opts = {id, country: 'uganda'};
            const [pupilTeacherRatioGovtSchl, pupilTeacherRatioOtherSchl, primaryEducationfunding] =
                await this.getIndicatorsGeneric(id, [sql.pupilTeacherRatioGovtSchl, sql.pupilTeacherRatioOtherSchl,
                    sql.primaryEducationfunding]);
            const [studentsPassRate] = await this.getIndicatorsGeneric(id, [sql.studentsPassRate], false);
            const studentsPassDistrictRank = await this.getDistrictIndicatorRank(opts, sql.studentsPassDistrictRank);
            return {
                pupilTeacherRatioGovtSchl,
                pupilTeacherRatioOtherSchl,
                studentsPassRate,
                studentsPassDistrictRank,
                primaryEducationfunding
          };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getHealthTabRegional({id}): Promise<DH.IHealthTabRegionalUg> {
        try {
            const [districtPerformance, treatmeantOfTb] =
                await this.getIndicatorsGeneric(id, [sql.districtHealthPerformance, sql.treatmeantOfTb]);
            const [healthCareFunding] = await this.getIndicatorsGeneric(id, [sql.healthCareFunding], true);
            const districtHealthRank =
                await this.getDistrictIndicatorRank({country, id}, sql.districtHealthPerformanceRank);
            return {
                districtPerformance,
                districtHealthRank,
                treatmeantOfTb,
                healthCareFunding // Fix me
            };
       }    catch (error) {
           console.error(error);
           throw error;
       }
    }
}

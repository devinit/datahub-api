import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../../db';
import {uganda} from './sql';
import {getRegionalResources, getIndicatorsGeneric, getPopulationDistribution, getDistrictIndicatorRank} from './utils';

interface ISpotlightArgs {
    id: string;
}

const sql = uganda;
const country = 'uganda';
const getIndicatorsGenericUg = getIndicatorsGeneric('uganda');

export default class Uganda {
    private db: IDatabase<IExtensions> & IExtensions;
    constructor(db: any) {
        this.db = db;
    }
    // id eg uganda or kenya
    public async getOverViewTabRegional(opts: ISpotlightArgs): Promise<DH.IOverviewTabRegional> {
        try {
            const regionalResources = await getRegionalResources({...opts, sql});
            const [poorestPeople, localGovernmentSpendPerPerson] =
                await getIndicatorsGeneric(opts, [sql.poorestPeople, sql.localGovernmentSpendPerPerson]);
            return {
                ...regionalResources,
                poorestPeople,
                localGovernmentSpendPerPerson
           };
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    public async getPopulationTabRegional({id}): Promise<DH.IPopulationTabRegional> {
        try {
            const [totalPopulation, populationDensity, averageDependencyRatio, allAverageDependencyRatio]
             = await getIndicatorsGenericUg(id,
                [sql.totalPopulation, sql.populationDensity,
                sql.averageDependencyRatio, sql.allAverageDependencyRatio]);
            const populationDistribution = await getPopulationDistribution({id, country, sql});
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
    public async getPovertyTabRegional({id}): Promise<DH.IPovertyTabUg> {
        try {
            const [poorestPeople, lifeExpectancy, stdOfLiving] =
                await  getIndicatorsGenericUg(id, [sql.poorestPeople, sql.lifeExpectancy, sql.stdOfLiving]);
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
    public async getEducationTabRegional({id}): Promise<DH.IEducationTabRegional> {
         try {
            const opts = {id, country: 'uganda'};
            const [pupilTeacherRatioGovtSchl, pupilTeacherRatioOtherSchl, primaryEducationfunding] =
                await getIndicatorsGenericUg(id, [sql.pupilTeacherRatioGovtSchl, sql.pupilTeacherRatioOtherSchl,
                    sql.primaryEducationfunding]);
            const [studentsPassRate] = await getIndicatorsGenericUg(id, [sql.studentsPassRate], false);
            const studentsPassDistrictRank = await getDistrictIndicatorRank(opts, sql.studentsPassDistrictRank);
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
    public async getHealthTabRegional({id}): Promise<DH.IHealthTabRegional> {
        try {
            const [districtPerformance, treatmeantOfTb] =
                await getIndicatorsGenericUg(id, [sql.districtHealthPerformance, sql.treatmeantOfTb]);
            const [healthCareFunding] = await getIndicatorsGenericUg(id, [sql.healthCareFunding], true);
            const districtHealthRank = await getDistrictIndicatorRank({country, id}, sql.districtHealthPerformanceRank);
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

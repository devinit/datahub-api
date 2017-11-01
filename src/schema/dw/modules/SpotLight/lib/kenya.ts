import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../../db';
import {kenya} from './sql';
import {getRegionalResources, getIndicatorsGeneric, getPopulationDistribution, getDistrictIndicatorRank} from './utils';

interface ISpotlightArgs {
    id: string;
    country: string;
}

const sql = kenya;
const getIndicatorsGenericKe = getIndicatorsGeneric('kenya');

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
    public async getPopulationTabRegional(opts: ISpotlightArgs): Promise<DH.IPopulationTabRegional> {
        try {
            const [totalPopulation, populationDensity, averageDependencyRatio, allAverageDependencyRatio]
             = await getIndicatorsGeneric(opts,
                [sql.totalPopulation, sql.populationDensity,
                sql.averageDependencyRatio, sql.allAverageDependencyRatio]);
            const populationDistribution = await getPopulationDistribution(opts);
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
    public async getPovertyTabRegional({id}): Promise<DH.IPovertyTabKe> {
        try {
            const [poorestPeople, povertyGap, meanExpenditure] =
                await getIndicatorsGenericKe(id, [sql.poorestPeople, sql.povertyGap, sql.meanExpenditure]);
            return {
                poorestPeople,
                povertyGap,
                meanExpenditure
            };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getEducationTabRegional(opts: ISpotlightArgs): Promise<DH.IEducationTabRegional> {
         try {
            const [pupilTeacherRatioGovtSchl, pupilTeacherRatioOtherSchl, primaryEducationfunding] =
                await getIndicatorsGeneric(opts, [sql.pupilTeacherRatioGovtSchl, sql.pupilTeacherRatioOtherSchl,
                    sql.primaryEducationfunding]);
            const [studentsPassRate] = await getIndicatorsGeneric(opts, [sql.studentsPassRate], false);
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
    public async getHealthTabRegional(opts): Promise<DH.IHealthTabRegional> {
        try {
            const [districtPerformance, treatmeantOfTb] =
                await getIndicatorsGeneric(opts, [sql.districtHealthPerformance, sql.treatmeantOfTb]);
            const [healthCareFunding] = await getIndicatorsGeneric(opts, [sql.healthCareFunding], true);
            const districtHealthRank = await getDistrictIndicatorRank(opts, sql.districtHealthPerformanceRank);
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

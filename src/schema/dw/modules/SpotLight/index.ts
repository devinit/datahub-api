import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile,
        indicatorDataProcessingSimple, getTotal, IRAWPopulationGroup, } from '../utils';

export default class SpotLight {
    getRegionalResourcesBreakDown: any;
    getExpenditure: any;
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;

    }
    public async getOverViewTabRegional({id}): Promise<DH.IOverViewTabRegional> {
        const  poorestPeople = await this.getPoorestPeople(id);
        const regionalResources = await this.getRegionalResources(id);
        const regionalResourcesBreakdown = await this.getRegionalResourcesBreakDown(id);
        const localGovernmentSpendPerPerson = await this.getLocalGovernmentSpendPerPerson(id);
        return {
            poorestPeople,
            regionalResources,
            regionalResourcesBreakdown,
            localGovernmentSpendPerPerson
        };
    }
    public async getPopulationTabRegional({id}): Promise<DH.IPopulationTabRegional> {
        const totalPopulation = await this.getTotalPopulation(id);
        const populationDensity = await this.getPopulationDensity(id);
        const populationDistribution = await this.getPopulationDistribution(id);
        const averageDependencyRatio = await this.getAverageDependencyRatio(id);
        const allAverageDependencyRatio = await this.getAllAverageDependencyRatio(id);
        return {
            totalPopulation,
            populationDensity,
            populationDistribution,
            averageDependencyRatio,
            allAverageDependencyRatio
        };
    }
    public async getPovertyTabRegional({id}): Promise<DH.IPovertyTabRegional> {
        const poorestPeople = await this.getPoorestPeople(id);
        const lifeExpectancy = await this.getLifeExpectancy(id);
        const stdOfLiving = await this.getStdOfLiving(id);
        return {
            poorestPeople,
            lifeExpectancy,
            stdOfLiving
        };
    }

    public async getEducationTabRegional(id: string): Promise<DH.IEducationTabRegional> {
        const pupilTeacherRatioGovtSchl  = await this.getPupilTeacherRatioGovtSchl(id);
        const pupilTeacherRatioOtherSchl = await this.getPupilTeacherRatioOtherSchl(id);
        const studentsPass = await this.getStudentsPass(id);
        const primaryEducationfunding = await this.getPrimaryEducationfunding(id);
        return {
            pupilTeacherRatioGovtSchl,
            pupilTeacherRatioOtherSchl,
            studentsPass,
            primaryEducationfunding
        };
    }
    public async getHealthTabRegional(id: string): Promise<DH.IHealthTabRegional> {
        const districtPerformance = await this.getDistrictPerformance(id);
        const treatmeantOfTb = await this.getTreatmeantOfTb(id);
        const healthCareFunding = await this.gethealthCareFunding(id);
        return {
            districtPerformance,
            treatmeantOfTb,
            healthCareFunding
        };
    }
    public async getLocalGovernmentFinance(id): Promise<DH.ILocalGovernmentFinance> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__finance WHERE',
            query: sql.localGovernmentFinance,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);

    }
    private async getRegionalResources(id): Promise<string> {
        // TODO: Regional resource breakdon
        const lgfResources = await this.getLgfResources(id);
        const centralResources = await this.getCentralResources(id);
        const donorResources = await this.getDonorResources(id);
        const sum = centralResources + lgfResources + donorResources;
        return formatNumbers(sum, 1);
    }
    private async getLgfResources(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_igf_resources',
            query: sql.lGFResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getCentralResources(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_central_resources',
            query: sql.crResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getDonorResources(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_donor_resources',
            query: sql.dResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getTotalPopulation(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_total_pop',
            query: sql.totalPopulation,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const totalPopulation: number = Number(data[0].value);
        return formatNumbers(totalPopulation, 0);
    }
    private async getPoorestPeople(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
             ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_poverty',
            query: sql.poorestPeople,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return formatNumbers(poorestPeople, 1);
    }
    private async getLocalGovernmentSpendPerPerson(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            table: 'spotlight_on_uganda.uganda_gov_spend_pp',
            query: sql.localGovernmentSpendPerPerson,
            id,
            ...this.defaultArgs,
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return poorestPeople.toFixed(0);
    }
    private async getAverageDependencyRatio(id): Promise<string> {
         const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__dependency_ratio',
            query: sql.averageDependencyRatio,
            id
        };
         const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
         return formatNumbers(Number(data[0].value), 1);
    }
    private async getPopulationDistribution(id): Promise<DH.IPopulationDistribution[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_urban_rural_pop',
            query: sql.populationDistribution,
            id
        };
        const data: IRAWPopulationGroup[] = await getIndicatorData<IRAWPopulationGroup>(indicatorArgs);
        return data.reduce((acc: DH.IPopulationDistribution[], row) => {
            const rural = {group: 'rural', value: Number(row.value_rural), year: Number(row.year) };
            const urban = {group: 'urban', value: Number(row.value_urban),  year: Number(row.year) };
            return [...acc, rural, urban];
        }, []);
    }
    private async getPopulationDensity(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__pop_dens',
            query: sql.populationDensity,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
        }
    private async getAllAverageDependencyRatio(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_dependency_ratio',
            query: sql.allAverageDependencyRatio,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getLifeExpectancy(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__life_expectancy',
            query: sql.lifeExpectancy,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getStdOfLiving(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_deprivation_living',
            query: sql.stdOfLiving,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getPupilTeacherRatioGovtSchl(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_primary_stu_teach_ratio',
            query: sql.pupilTeacherRatioGovtSchl,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getPupilTeacherRatioOtherSchl(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_primary_stu_teach_ratio',
            query: sql.pupilTeacherRatioOtherSchl,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getStudentsPass(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__exam_perf_rate',
            query: sql.studentsPass,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
     private async getPrimaryEducationfunding(id): Promise<String> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda__primary_educ_funding',
            query: sql.primaryEducationfunding,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
     private async getDistrictPerformance(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_overall_health',
            query: sql.districtHealthPerformance,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getTreatmeantOfTb(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_tb_success',
            query: sql.treatmeantOfTb,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async gethealthCareFunding(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_health_funding',
            query: sql.healthCareFunding,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
}

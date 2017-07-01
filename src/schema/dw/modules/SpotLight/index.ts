import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile,
        indicatorDataProcessingSimple, getTotal, IRAWPopulationGroup, } from '../utils';

export default class SpotLight {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;

    }
    public async getOverViewTabRegional({id}): Promise<DH.OverViewTab> {
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
    public async getPopulationTab({id}): Promise<DH.IPopulationTab> {
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
    public async getPovertyTab({id}): Promise<any> {
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
    public async getLocalGovernmentFinance(id: string): Promise<DH.ILocalGovernmentFinance> {
        const revenue = await this.getRevenue(id);
        const expenditure = await this.getExpenditure(id);
        return {
            revenue,
            expenditure,
        };
    }
    private async getInternationalResources(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            table: 'data_series.intl_flows_recipients',
            query: sql.internationalResources,
            id,
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const totalResources: number = getTotal(data);
        return formatNumbers(totalResources, 1);
    }
    private async getRegionalResources(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'spotlight_on_uganda.uganda_igf_resources',
            query: sql.lGFResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const localResources: number = Number(data[0].value);
        return formatNumbers(localResources, 1);
    }
    private async getTotalPopulation(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
           
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
    private async getLocalGovernmentSpendPerPerson(id, theme): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            table: 'spotlight_on_uganda.uganda_gov_spend_pp',
            query: sql.localGovernmentSpendPerPerson,
            id,
            ...this.defaultArgs,
            theme
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return poorestPeople.toFixed(0);
    }
    private async getAverageDependencyRatio(id): Promise<DH.IIndicatorData[]> {
         const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,

        };
         const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
         return indicatorDataProcessingSimple<DH.IIndicatorData>(data);
    }
    private async getIncomeDistTrend(id): Promise<DH.IQuintile[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            
        };
        const data: IRAWQuintile[] = await getIndicatorData<IRAWQuintile>(indicatorArgs);
        
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
    private async getPopulationDensity(id): Promise<DH.IPopulationDensity[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,

        };
        const data: IRAWPopulationAgeBand[] = await getIndicatorData<IRAWPopulationAgeBand>(indicatorArgs);

    }
    private async getAllAverageDependencyRatio(id): Promise<DH.IIndicatorData[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
        };
        const data: IRAWMulti[] = await getIndicatorData<IRAWMulti>(indicatorArgs);

    }
    private async getLifeExpectancy(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,

        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Math.round(Number(data[0].value));
    }
    private async getStdOfLiving(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,

        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Math.round(Number(data[0].value));
    }
}

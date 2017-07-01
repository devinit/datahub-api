// TODO: handle no-data values
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile,
        indicatorDataProcessingSimple, getTotal, IRAWPopulationGroup, IRAWMulti} from '../utils';

export default class CountryProfileTabs {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultDonorArgs;
    private defaultRecipientArgs;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'country-profile'};
        this.defaultDonorArgs = {db: this.db, theme: DONOR};
        this.defaultRecipientArgs = {db: this.db, theme: RECIPIENT};
    }
    public async getOverViewTab({id}): Promise<DH.OverViewTab> {
        const isDonorCountry =  await isDonor(id);
        if (isDonorCountry) return this.getOverViewTabDonors(id);
        return this.getOverViewTabRecipients(id);
    }
    public async getPopulationTab({id}): Promise<DH.IPopulationTab> {
        const population = await this.getPopulation(id);
        const populationDistribution = await this.getPopulationDistribution(id);
        const populationPerAgeBand = await this.getPopulationPerAgeBand(id);
        return {
            population,
            populationDistribution,
            populationPerAgeBand
        };
    }
    public async getPovertyTab({id}): Promise<any> {
        const poverty190Trend = await this.getPoverty190Trend(id);
        const depthOfExtremePoverty = await this.getDepthOfExtremePoverty(id);
        const incomeDistTrend = await this.getIncomeDistTrend(id);
        return {
            poverty190Trend,
            depthOfExtremePoverty,
            incomeDistTrend
        };
    }

    public async getOverViewTabRecipients(countryId: string): Promise<DH.IOverViewTabRecipients> {
        const internationalResources  = await this.getInternationalResources(countryId);
        const domesticPublicResources = await this.getDomesticPublicResources(countryId);
        const population = await this.getPopulation(countryId);
        const poorestPeople = await this.getPoorestPeople(countryId);
        const governmentSpendPerPerson = await this.getGovernmentSpendPerPerson(countryId, RECIPIENT);
        return {
            internationalResources,
            domesticPublicResources,
            population,
            poorestPeople,
            governmentSpendPerPerson
        };
    }
    public async getOverViewTabDonors(countryId: string): Promise<DH.IOverViewTabDonors> {
        const governmentSpendPerPerson = await this.getGovernmentSpendPerPerson(countryId, DONOR);
        const averageIncomerPerPerson = await this.getAverageIncomerPerPerson(countryId);
        const incomeDistTrend = await this.getIncomeDistTrend(countryId);
        return {
            governmentSpendPerPerson,
            averageIncomerPerPerson,
            incomeDistTrend
        };
    }
    private async getInternationalResources(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            query: sql.internationalResources,
            id,
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const totalResources: number = getTotal(data);
        return formatNumbers(totalResources, 1);
    }
    private async getDomesticPublicResources(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            query: sql.domesticPublicResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const domesticRevenue: number = Number(data[0].value);
        return formatNumbers(domesticRevenue, 1);
    }
    private async getPopulation(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'fact.population_total',
            query: sql.population,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const totalPopulation: number = Number(data[0].value);
        return formatNumbers(totalPopulation, 0);
    }
    private async getPoorestPeople(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            query: sql.poorestPeople,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return formatNumbers(poorestPeople, 1);
    }
    private async getGovernmentSpendPerPerson(id, theme): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            query: sql.governmentSpendPerPerson,
            id,
            ...this.defaultArgs,
            theme
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return poorestPeople.toFixed(0);
    }
    private async getAverageIncomerPerPerson(id): Promise<DH.IIndicatorData[]> {
         const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultDonorArgs,
            query: sql.averageIncomerPerPerson,
            id
        };
         const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
         return indicatorDataProcessingSimple<DH.IIndicatorData>(data);
    }
    private async getIncomeDistTrend(id): Promise<DH.IQuintile[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultDonorArgs,
            query: sql.incomeDistTrend,
            id
        };
        const data: IRAWQuintile[] = await getIndicatorData<IRAWQuintile>(indicatorArgs);
        const quintileData = R.last(data.filter(obj => obj.value_2nd_quintile !== null)) as IRAWQuintile;
        return R.keys(quintileData).map(key => ({quintileName: key, value: Number(data[0][key])}));
    }
    private async getPopulationDistribution(id): Promise<DH.IPopulationDistribution[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
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
    private async getPopulationPerAgeBand(id): Promise<DH.IPopulationPerAgeBand[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.populationPerAgeBand,
            id
        };
        const data: IRAWPopulationAgeBand[] = await getIndicatorData<IRAWPopulationAgeBand>(indicatorArgs);
        const groupColumns: string[] = R.keys(data[0]).filter(key => key !== 'year' && key !== 'di_id');
        return data.reduce((acc: DH.IPopulationPerAgeBand[], row) => {
            const groups: DH.IPopulationPerAgeBand[] = groupColumns
                .map(key => ({band: normalizeKeyName(key), value: Number(row[key]), year: Number(row.year) }));
            return [...acc, ...groups];
        }, []);
    }
    private async getPoverty190Trend(id): Promise<DH.IIndicatorData[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            query: sql.poverty190Trend,
            id,
            ...this.defaultArgs
        };
        const data: IRAWMulti[] = await getIndicatorData<IRAWMulti>(indicatorArgs);
        return indicatorDataProcessingSimple<DH.IIndicatorData>(data, 'value_2');
    }
    private async getDepthOfExtremePoverty(id): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            query: sql.depthOfExtremePoverty,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Math.round(Number(data[0].value));
    }
}

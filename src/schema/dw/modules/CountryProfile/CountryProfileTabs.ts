import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import sql from './sql';
import * as shortid from 'shortid';
import * as R from 'ramda';
import {getIndicatorData, IGetIndicatorArgs, isDonor, indicatorDataProcessingNamed, DONOR,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile, RECIPIENT,
        IRAWPopulationGroup, getIndicatorToolTip, getIndicatorsValue} from '../utils';

interface IOverViewTabRecipients {
    countryType: string;
    poorestPeople: DH.IIndicatorValueWithToolTip;
    population: DH.IIndicatorValueWithToolTip;
    domesticResources: DH.IIndicatorValueWithToolTip;
    governmentSpendPerPerson: DH.IIndicatorValueWithToolTip;
    internationalResources: DH.IIndicatorValueWithToolTip;
}
interface IOverViewTabDonors {
    countryType: string;
    governmentSpendPerPerson: DH.IIndicatorValueWithToolTip;
    averageIncomerPerPerson: DH.IIndicatorDataWithToolTip;
    incomeDistTrend: DH.IQuintileDataWithToolTip;
}
const red = '#e8443a';
const grey = '#847e84';
export default class CountryProfileTabs {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'country-profile'};
    }

    public async getOverViewTab({id}): Promise<DH.IOverviewTab> {
        try {
            const isDonorCountry =  await isDonor(id);
            if (isDonorCountry) {
                const donorsTabData = await this.getOverViewTabDonors(id);
                return {
                    ...donorsTabData,
                    poorestPeople: null,
                    population: null, domesticResources: null, internationalResources: null};
            }
            const recipientTabData = await this.getOverViewTabRecipients(id);
            return {
                ...recipientTabData,
                averageIncomerPerPerson: null, incomeDistTrend: null, countryType: RECIPIENT};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getPopulationTab({id}): Promise<DH.IPopulationTab> {
       try {
           const [population] = await getIndicatorsValue({id, sqlList: [sql.population], ...this.defaultArgs});
           const populationDistribution = await this.getPopulationDistribution(id);
           const populationPerAgeBand = await this.getPopulationPerAgeBand(id);
           return {
                population,
                populationDistribution,
                populationPerAgeBand
          };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getPovertyTab({id}): Promise<DH.IPovertyTab> {
        try {
            const isDonorCountry =  await isDonor(id);
            if (isDonorCountry) return {poverty190Trend: null, depthOfExtremePoverty: null, incomeDistTrend: null};
            const poverty190Trend = await this.getPoverty190Trend(id);
            const [depthOfExtremePoverty] =
                await getIndicatorsValue({
                    id,
                    sqlList: [sql.depthOfExtremePoverty], format: false, ...this.defaultArgs});
            const incomeDistTrend = await this.getIncomeDistTrend(id);
            return {
                poverty190Trend,
                depthOfExtremePoverty,
                incomeDistTrend
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getOverViewTabRecipients(countryId: string): Promise<IOverViewTabRecipients> {
        try {
            const sqlList =  [sql.internationalResources, sql.domesticRevenue, sql.population,
                sql.poorestPeople, sql.governmentSpendPerPerson];
            const [internationalResources, domesticResources, population, poorestPeople, governmentSpendPerPerson]
                = await getIndicatorsValue({id: countryId, sqlList, ...this.defaultArgs});
            return {
                countryType: RECIPIENT,
                internationalResources,
                domesticResources,
                population,
                poorestPeople,
                governmentSpendPerPerson
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getOverViewTabDonors(countryId: string): Promise<IOverViewTabDonors> {
        try {
            const [governmentSpendPerPerson] = await
                getIndicatorsValue({id: countryId, sqlList: [sql.governmentSpendPerPerson], ...this.defaultArgs});
            const averageIncomerPerPerson = await this.getAverageIncomerPerPerson(countryId);
            const incomeDistTrend = await this.getIncomeDistTrend(countryId);
            return {
                countryType: DONOR,
                governmentSpendPerPerson,
                averageIncomerPerPerson,
                incomeDistTrend
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    private async getAverageIncomerPerPerson(id): Promise<DH.IIndicatorDataWithToolTip> {
         try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.averageIncomerPerPerson,
                id
            };
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            const raw: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            const data: DH.IIndicatorData[] = await indicatorDataProcessingNamed(raw);
            return {data, toolTip};
         } catch (error) {
             throw error;
         }
    }
    private async getIncomeDistTrend(id): Promise<DH.IQuintileDataWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.incomeDistTrend,
                id
            };
            const raw: IRAWQuintile[] = await getIndicatorData<IRAWQuintile>(indicatorArgs);
            const quintileData = R.last(raw.filter(obj => obj.value_2nd_quintile !== null)) as IRAWQuintile;
            const data: DH.IQuintile[] = R.keys(quintileData)
                .map(key => {
                    const color = key === 'value_bottom_20pc' ? red : grey;
                    return {quintileName: key, color, value: Number(data[0][key]), uid: shortid.generate()};
                });
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {data, toolTip};
        } catch (error) {
           throw error;
        }
    }
    private async getPopulationDistribution(id): Promise<DH.IPopulationDistributionWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.populationDistribution,
                id
            };
            const raw: IRAWPopulationGroup[] = await getIndicatorData<IRAWPopulationGroup>(indicatorArgs);
            const data = raw.reduce((acc: DH.IPopulationDistribution[], row) => {
                const rural = {group: 'rural', value: Number(row.value_rural), year: Number(row.year) };
                const urban = {group: 'urban', value: Number(row.value_urban),  year: Number(row.year) };
                return [...acc, rural, urban];
            }, []);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {toolTip, data};
       } catch (error) {
           throw error;
       }
    }
    private async getPopulationPerAgeBand(id): Promise<DH.IPopulationPerAgeBandWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.populationPerAgeBand,
                id
            };
            const raw: IRAWPopulationAgeBand[] = await getIndicatorData<IRAWPopulationAgeBand>(indicatorArgs);
            const groupColumns: string[] = R.keys(raw[0]).filter(key => key !== 'year' && key !== 'di_id');
            const data: DH.IPopulationPerAgeBand[] = raw.reduce((acc: DH.IPopulationPerAgeBand[], row) => {
                const groups: DH.IPopulationPerAgeBand[] = groupColumns
                    .map(key => ({band: normalizeKeyName(key), value: Number(row[key]),
                        year: Number(row.year), uid: shortid.generate() }));
                return [...acc, ...groups];
            }, []);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {data, toolTip};
        } catch (error) {
            throw error;
        }
    }
    private async getPoverty190Trend(id): Promise<DH.IIndicatorDataWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                query: sql.poverty190Trend,
                id,
                ...this.defaultArgs
            };
            const raw: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            const data: DH.IIndicatorData[] = await indicatorDataProcessingNamed(raw);
            const toolTip: DH.IToolTip = await getIndicatorToolTip(indicatorArgs);
            return {data, toolTip};
        } catch (error) {
           throw error;
        }
    }
}

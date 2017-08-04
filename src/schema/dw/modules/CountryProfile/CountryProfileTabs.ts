import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import sql from './sql';
import * as shortid from 'shortid';
import * as R from 'ramda';
import {getIndicatorData, IGetIndicatorArgs, isDonor, indicatorDataProcessingNamed, DONOR,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile, RECIPIENT, formatNumbers,
        IRAWPopulationGroup} from '../utils';

interface IOverViewTabRecipients {
    countryType: string;
    poorestPeople: string;
    population: string;
    domesticResources: string;
    governmentSpendPerPerson: string;
    internationalResources: string;
}
interface IOverViewTabDonors {
    countryType: string;
    governmentSpendPerPerson: string;
    averageIncomerPerPerson: DH.IIndicatorData[];
    incomeDistTrend: DH.IQuintile[];
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

    public async getOverViewTab({id}): Promise<DH.IOverViewTab> {
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
           const [population] = await this.getIndicatorsGeneric(id, [sql.population]);
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
            const [depthOfExtremePoverty] = await this.getIndicatorsGeneric(id, [sql.depthOfExtremePoverty], false);
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
            const [internationalResources, domesticResources, population, poorestPeople, governmentSpendPerPerson]
            = await this.getIndicatorsGeneric(countryId,
                [sql.internationalResources, sql.domesticRevenue, sql.population,
                sql.poorestPeople, sql.governmentSpendPerPerson]);
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
            // tslint:disable-next-line:max-line-length
            const [governmentSpendPerPerson] = await this.getIndicatorsGeneric(countryId, [sql.governmentSpendPerPerson]);
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
    private async getIndicatorsGeneric(id: string, sqlList: string[], format: boolean = true)
        : Promise<string[]>  {
        try {
            const indicatorArgs: IGetIndicatorArgs[] =
                sqlList.map(query => ({...this.defaultArgs, query, id}));
            const indicatorRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
            return indicatorRaw.map(data => format ? formatNumbers(data[0].value, 1) : (data[0].value));
        } catch (error) {
            throw error;
        }
    }

    private async getAverageIncomerPerPerson(id): Promise<DH.IIndicatorData[]> {
         try {
             const indicatorArgs: IGetIndicatorArgs = {
             ...this.defaultArgs,
             query: sql.averageIncomerPerPerson,
             id
          };
             const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
             return indicatorDataProcessingNamed(data);
         } catch (error) {
             throw error;
         }
    }
    private async getIncomeDistTrend(id): Promise<DH.IQuintile[]> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.incomeDistTrend,
            id
        };
            const data: IRAWQuintile[] = await getIndicatorData<IRAWQuintile>(indicatorArgs);
            const quintileData = R.last(data.filter(obj => obj.value_2nd_quintile !== null)) as IRAWQuintile;
            return R.keys(quintileData)
                .map(key => {
                    const color = key === 'value_bottom_20pc' ? red : grey;
                    return {quintileName: key, color, value: Number(data[0][key]), uid: shortid.generate()};
                });
        } catch (error) {
           throw error;
        }
    }
    private async getPopulationDistribution(id): Promise<DH.IPopulationDistribution[]> {
        try {
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
       } catch (error) {
           throw error;
       }
    }
    private async getPopulationPerAgeBand(id): Promise<DH.IPopulationPerAgeBand[]> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.populationPerAgeBand,
            id
        };
            const data: IRAWPopulationAgeBand[] = await getIndicatorData<IRAWPopulationAgeBand>(indicatorArgs);
            const groupColumns: string[] = R.keys(data[0]).filter(key => key !== 'year' && key !== 'di_id');
            return data.reduce((acc: DH.IPopulationPerAgeBand[], row) => {
            const groups: DH.IPopulationPerAgeBand[] = groupColumns
                .map(key => ({band: normalizeKeyName(key), value: Number(row[key]),
                    year: Number(row.year), uid: shortid.generate() }));
            return [...acc, ...groups];
          }, []);
        } catch (error) {
            throw error;
        }
    }
    private async getPoverty190Trend(id): Promise<DH.IIndicatorData[]> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            query: sql.poverty190Trend,
            id,
            ...this.defaultArgs
        };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            return indicatorDataProcessingNamed(data);
        } catch (error) {
           throw error;
        }
    }
}

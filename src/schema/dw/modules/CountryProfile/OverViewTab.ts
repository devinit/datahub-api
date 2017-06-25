 // tslint:disable-next-line:no-reference
 /// <reference path="../../../../types/dh.d.ts" />
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import {getEntityByIdAsync, IEntity} from '../../../cms/modules/global';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData,
        RECIPIENT,
        DONOR,
        IGetIndicatorArgs,
        IRAW, IRAWQuintile, indicatorDataProcessingSimple, getTotal} from '../utils';

export default class OverViewTab {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultDonorArgs;
    private defaultRecipientArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultDonorArgs = {db: this.db, theme: DONOR};
        this.defaultRecipientArgs = {db: this.db, theme: RECIPIENT};
    }
    public async getOverViewTab(opts): Promise<DH.OverViewTab> {
        const countryId = opts.id;
        const {donorRecipientType}: IEntity = await getEntityByIdAsync(countryId);
        if (donorRecipientType === DONOR) return this.getOverViewTabDonors(countryId);
        return this.getOverViewTabRecipients(countryId);
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
            table: 'data_series.intl_flows_recipients',
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
            table: 'data_series.domestic',
            query: sql.domesticPublicResources,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const domesticRevenue: number = Number(data[0].value);
        return formatNumbers(domesticRevenue, 1);
    }
    private async getPopulation(id): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
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
            table: 'data_series.poorest_20_percent',
            query: sql.poorestPeople,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return formatNumbers(poorestPeople, 1);
    }
    private async getGovernmentSpendPerPerson(id, theme): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            table: 'data_series.govt_spend_pc',
            query: sql.governmentSpendPerPerson,
            id,
            db: this.db,
            theme
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return poorestPeople.toFixed(0);
    }
    private async getAverageIncomerPerPerson(id): Promise<DH.IIndicatorData[]> {
         const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultDonorArgs,
            table: 'fact.gni_pc_usd_2015',
            query: sql.averageIncomerPerPerson,
            id
        };
         const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
         return indicatorDataProcessingSimple<DH.IIndicatorData>(data);
    }
    private async getIncomeDistTrend(id): Promise<DH.IQuintile[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultDonorArgs,
            table: 'fact.income_share_by_quintile',
            query: sql.incomeDistTrend,
            id
        };
        const data: IRAWQuintile[] = await getIndicatorData<IRAWQuintile>(indicatorArgs);
        return R.keys(data[0]).map(key => ({quintileName: key, value: Number(data[0][key])}));
    }
}

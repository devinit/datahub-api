 // tslint:disable-next-line:no-reference
 /// <reference path="../../../../types/dh.d.ts" />
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getTotal, formatNumbers, indicatorDataProcessing, getCurrentYear} from '../../../../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {isNumber} from '../../../../lib/isType';
import sql from './sql';
import * as R from 'ramda';

interface IOverViewTabItem {
    [key: string]: number;
}

interface IGetindicatorArgs {
    id: string;
    table: string;
    query: string;
    theme: string;
}

const RECIPIENT = 'recipient';
const DONOR = 'donor';

export default class CountryProfile {
    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getOverViewTabRecipients(opts): Promise<DH.IOverViewTabRecipients> {
        const countryId = opts.id;
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
    private async getIndicatorData({table, query, id, theme}: IGetindicatorArgs):
        Promise<Array<{value: string}>> {
            const concept: IConcept = await getConceptAsync('country-profile', table, theme);
            const queryArgs = {startYear: concept.startYear, id};
            return this.db.manyCacheable(sql[query], queryArgs);
        }
    private async getInternationalResources(id): Promise<string> {
        const indicatorArgs: IGetindicatorArgs = {
            table: 'data_series.intl_flows_recipients',
            query: 'internationalResources',
            id,
            theme: RECIPIENT
        };
        const data: Array<{value: string}> = await this.getIndicatorData(indicatorArgs);
        const totalResources: number = getTotal(data);
        return formatNumbers(totalResources, 1);
    }
    private async getDomesticPublicResources(id): Promise<string> {
        const indicatorArgs: IGetindicatorArgs = {
            table: 'data_series.domestic',
            query: 'domesticPublicResources',
            id,
            theme: RECIPIENT
        };
        const data: Array<{value: string}> = await this.getIndicatorData(indicatorArgs);
        const domesticRevenue: number = Number(data[0].value);
        return formatNumbers(domesticRevenue, 1);
    }
    private async getPopulation(id): Promise<string> {
        const indicatorArgs: IGetindicatorArgs = {
            table: 'fact.population_total',
            query: 'population',
            id,
            theme: RECIPIENT
        };
        const data: Array<{value: string}> = await this.getIndicatorData(indicatorArgs);
        const totalPopulation: number = Number(data[0].value);
        return formatNumbers(totalPopulation, 0);
    }
    private async getPoorestPeople(id): Promise<string> {
        const indicatorArgs: IGetindicatorArgs = {
            table: 'data_series.poorest_20_percent',
            query: 'poorestPeople',
            id,
            theme: RECIPIENT
        };
        const data: Array<{value: string}> = await this.getIndicatorData(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return formatNumbers(poorestPeople, 1);
    }
    private async getGovernmentSpendPerPerson(id, theme): Promise<string> {
        const indicatorArgs: IGetindicatorArgs = {
            table: 'data_series.govt_spend_pc',
            query: 'governmentSpendPerPerson',
            id,
            theme
        };
        const data: Array<{value: string}> = await this.getIndicatorData(indicatorArgs);
        const poorestPeople: number = Number(data[0].value);
        return poorestPeople.toFixed(0);
    }

}

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

export default class CountryProfile {

    private db: IDatabase<IExtensions> & IExtensions;

    private overViewTabItems = {
        // population: {
        //     query: sql.population,
        //     conceptId: 'fact.population_total'
        // },
        // domesticPublicResources: {
        //     query: sql.domesticPublicResources,
        //     conceptId: 'data_series.domestic'
        // },
        internationalResources: {
            query: sql.internationalResources,
            conceptId: 'data_series.intl_flows_recipients'
        },
        // governmentSpendPerPerson: {
        //     query: sql.governmentSpendPerPerson,
        //     conceptId: 'data_series.govt_spend_pc'
        // },
        // poorestPeople: {
        //     query: sql.poorestPeople,
        //     conceptId: 'data_series.poorest_20_percent'
        // }

    };

    constructor(db: any) {
        this.db = db;
    }
    public async getOverViewTab(opts): Promise<any> {
        const countryId = opts.id;
        const internationalResources  = await this.getInternationalResources(countryId);
        return {
            internationalResources
        };
    }

    private async getInternationalResources(id): Promise<string> {
        const concept: IConcept = await getConceptAsync('country-profile', 'data_series.intl_flows_recipients');
        const args = {startYear: concept.startYear, id, direction: 'in'};
        const data: Array<{value: string}> = await this.db.manyCacheable(sql.internationalResources, args);
        const totalResources: number = getTotal(data);
        return formatNumbers(totalResources, 1);
    }
}

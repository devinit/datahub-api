import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getTotal, indicatorDataProcessing, getCurrentYear} from '../../../../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {isNumber} from '../../../../lib/isType';
import sql from './sql';
import * as R from 'ramda';

export default class CountryProfile {

    private db: IDatabase<IExtensions> & IExtensions;

    private overViewTab = {
        population: {
            query: sql.population,
            conceptId: 'fact.population'
        },
        domesticPublicResources: {
            query: sql.domesticPublicResources,
            conceptId: 'domestic'
        },
        internationalResources: {
            query: sql.internationalResources,
            conceptId: 'intl_flows_recipients'
        },
        governmentSpendPerPerson: {
            query: sql.governmentSpendPerPerson,
            conceptId: 'govt_spend_pc'
        },
        poorestPeople: {
            query: sql.poorestPeople,
            conceptId: 'poorest_20_percent'
        }

    };

    constructor(db: any) {
        this.db = db;
    }
    public async getOverViewTab(opts): DH.IOverViewTab {
        const countryId = opts.id;
        return R.keys(this.overVierTab).reduce(async (accumulatedTab, key) => {
            const obj = overViewTab[key];
            const concept: IConcept = await getConceptAsync('country-profile', obj.conceptId);
            const indicatorVaue = this.getIndicatorValue(countryId, obj.query, concept);
            return {...accumulatedTab, key: indicatorValue};
        }, {});
    }
    private async getIndicatorValue(id, sqlQuery, concept) {
        const data: {value: string} =
            await this.db.manyCacheable(sqlQuery, {startYear: concept.startYear, id});
        return Number(data.value);
    }
}

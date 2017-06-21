import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getTotal, indicatorDataProcessing, getCurrentYear} from '../../../../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {isNumber} from '../../../../lib/isType';
import sql from './sql';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    startYear: number;
    endYear: number;
    DACOnly: boolean;
}

export default class CountryProfile {

    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }
    public async getOverViewTab(opts) {
        const population: number = await this.getPopulation(opts.id);
    }
    /**
     *
     * @param id : id is country id
     */
    private async getPopulation(id) {
        const concept: IConcept = await getConceptAsync('country-profile', 'fact.population_total');
        const data: {value: string} = await this.db.manyCacheable(sql.population, {startYear: concept.startYear, id});
        return Number(data.value);
    }
}

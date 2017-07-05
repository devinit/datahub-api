import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {makeSqlAggregateQuery, entitesFnMap, DONOR, RECIPIENT, MULTILATERAL, CROSSOVER} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {IEntity, getEntities, getRegional, IRegional, getEntityByIdGeneric,
        getSectors, getBundles, getChannels} from '../../../cms/modules/global';
import * as R from 'ramda';

interface IUnbundlingAidQuery {
    from_di_id?: string;
    to_di_id?: string;
    year?: number;
    sector?: string;
    form?: string;
    channel_web_id?: string;
}
interface IUnBundlingAidCountries {
    to: DH.IIdNamePair[];
    from: DH.IIdNamePair[];
}

interface IUnbundlingEnitity {
    id: string;
    color?: string;
    name: string;
    type?: string;
    region?: string;
}

interface IUnbundlingAidResult extends IUnbundlingAidQuery {
    value: string;
}

export default class UnbundlingAid {

    private db: IDatabase<IExtensions> & IExtensions;
    private donorsBlackList = ['country-unspecified', 'region-unspecified', 'organisation-unspecified',
                    'arab-fund', 'afesd', 'idb-sp-fund'];
    constructor(db: any) {
        this.db = db;
    }
    public async getUnbundlingAidData(args: DH.IUnbundlingAidQuery): Promise<DH.IAidUnit[]> {
        const queryArgs =  this.getSqlQueryArgs(args);
        const table = this.getUnbundlingAidDataTable(args.aidType);
        const queryStr: string =
            makeSqlAggregateQuery<IUnbundlingAidQuery>(queryArgs, args.groupBy, table);
        const raw: IUnbundlingAidResult[] = await this.db.manyCacheable(queryStr, null);
        const entites: IUnbundlingEnitity[] = await entitesFnMap[args.groupBy]();
        const regions: IRegional[] = await getRegional();
        return raw.map((obj) => {
            const entity: IUnbundlingEnitity | undefined = entites.find(item => obj[args.groupBy] === item.id);
            if (!entity) throw new Error('error getting unbundling aid entity');
            let color = '';
            if (entity.type && entity.region) {
                const region: IRegional | undefined = getEntityByIdGeneric<IRegional>(entity.region, regions);
                if (region && region.color) color = region ? region.color : 'grey';
            }
            return {id: entity.id, value: Number(obj.value), name: entity.name,
                    color, year: Number(obj.year)};
        });
    }
    public async getUnbundlingSelectionData({aidType}): Promise<DH.IUnbundlingAidSelections> {
        const table = this.getUnbundlingAidDataTable(aidType);
        const concept: IConcept = await getConceptAsync(`unbundling-${aidType}`, table);
        if (!concept) throw new Error('error getting unbundling aid concept');
        const year = Number(concept.start_year);
        const years = R.range(year, year - 10);
        const countries = await this.getCountries();
        const channels = await getChannels();
        const sectors = await getSectors();
        const form = await getBundles();
        return {
            years,
            ...countries,
            channels,
            sectors,
            form
        };
    }
    public getSqlQueryArgs(args: DH.IUnbundlingAidQuery): IUnbundlingAidQuery {
        return R.omit(['groupBy', 'aidType'], args) as IUnbundlingAidQuery;
    }
    private getUnbundlingAidDataTable(aidType) {
        return aidType === 'oda' ? 'fact.oda_2015' : 'data_series.oof';
    }
    private async getCountries(): Promise<IUnBundlingAidCountries> {
        const entites: IEntity[] = await getEntities();
        return entites.reduce((countries: IUnBundlingAidCountries, entity) => {
            let result = {};
            if (entity.donor_recipient_type === RECIPIENT || entity.region === MULTILATERAL
                || entity.donor_recipient_type === CROSSOVER ) {
                const to = R.append(entity, countries.to);
                result = {...countries, to};
            }
            if (entity.donor_recipient_type === DONOR || entity.region === MULTILATERAL
                || entity.donor_recipient_type === CROSSOVER) {
                const from = R.contains(entity.id, this.donorsBlackList) ? countries.from :
                    R.append(entity, countries.from);
                result = {...countries, from};
            }
            return result as IUnBundlingAidCountries;
        }, {to: [], from: []});
    }

}

import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {makeSqlAggregateQuery, entitesFnMap, DONOR, RECIPIENT, MULTILATERAL, CROSSOVER} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {IEntity, getEntities, getEntityByIdAsync,
        getSectors, getBundles, getChannels} from '../../../cms/modules/global';
import * as R from 'ramda';

interface IUnbundlingAidQueryTemp {
    toCountry?: string;
    fromCountryOrOrg?: string;
    channel?: string;
}

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
}

interface IUnbundlingAidResult extends IUnbundlingAidQuery {
    total: number;
}

export default class UnbundlingAid {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(countryName =>
            R.find((obj: DH.IMapUnit) => obj.countryName === countryName, indicatorData));
    }

    private db: IDatabase<IExtensions> & IExtensions;
    private donorsBlackList = ['country-unspecified', 'region-unspecified', 'organisation-unspecified',
                    'arab-fund', 'afesd', 'idb-sp-fund'];
    private groupByMap = {
        channel: 'channel_web_id',
        to: 'to_di_id',
        from: 'from_di_id',
    };

    constructor(db: any) {
        this.db = db;
    }
    public async getUnbundlingAidData(args: DH.IUnbundlingAidQuery): Promise<DH.IAidUnit[]> {
        const queryArgs =  this.getSqlQueryArgs(args);
        const queryStr: string =
            makeSqlAggregateQuery<IUnbundlingAidQuery>(queryArgs, args.groupBy, `fact.${args.aidType}`);
        const raw: IUnbundlingAidResult[] = await this.db.manyCacheable(queryStr, null);
        const entites: IUnbundlingEnitity[] = await entitesFnMap[args.groupBy]();
        const groupByAsColumnName = this.groupByMap[args.groupBy] ? this.groupByMap[args.groupBy] : args.groupBy;
        return raw.map(obj => {
            const entity: IUnbundlingEnitity = entites.find(item => obj[groupByAsColumnName] === item.id);
            return { value: obj.total, name: entity.name, color: entity.color};
        });
    }

    public async getUnbundlingSelectionData({aidType}): Promise<DH.IUnbundlingAidSelections> {
        const concept: IConcept = await getConceptAsync(`unbundling-${aidType}`,  `fact.${aidType}`);
        const years = R.range(concept.startYear, concept.startYear - 10);
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
    private async getCountries(): Promise<IUnBundlingAidCountries> {
        const entites: IEntity[] = await getEntities();
        return entites.reduce((countries: IUnBundlingAidCountries, entity) => {
            let result = {};
            if (entity.donorRecipientType === RECIPIENT || entity.region === MULTILATERAL
                || entity.donorRecipientType === CROSSOVER ) {
                const to = R.append(entity, countries.to);
                result = {...countries, to};
            }
            if (entity.donorRecipientType === DONOR || entity.region === MULTILATERAL
                || entity.donorRecipientType === CROSSOVER) {
                const from = R.contains(entity.id, this.donorsBlackList) ? countries.from :
                    R.append(entity, countries.from);
                result = {...countries, from};
            }
            return result as IUnBundlingAidCountries;
        }, {to: [], from: []});
    }

    private getSqlQueryArgs(args: DH.IUnbundlingAidQuery): IUnbundlingAidQuery {
        const transformed = this.transformQueryArgs(args);
        return R.omit(['groupBy', 'aidType'], transformed);
    }

    private transformQueryArgs(args: DH.IUnbundlingAidQuery): IUnbundlingAidQuery {
        return R.keys(args).reduce((acc, key) => {
            if (this.groupByMap[key]) {
                const newObj = {...acc, [this.groupByMap[key]]: args[key]};
                return R.omit([key], newObj);
            }
            return acc;
        }, {});
    }
}

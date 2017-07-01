import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {makeSqlAggregateQuery, entitesFnMap} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';

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

    private groupByMap = {
        channel: 'channel_web_id',
        toCountry: 'to_di_id',
        fromCountryOrOrg: 'from_di_id',
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
     // TODO: add selection data fn
    public async getUnbundlingSelectionData(): Promise<DH.UnbundlingAidSelections> {
        // import the functions for getting the required data from the cms/global modules.
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

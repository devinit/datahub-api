import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {IRAWODA, makeSqlAggregateQuery} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    DACOnly: boolean;
}

export default class UnbundlingAid {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(countryName =>
            R.find((obj: DH.IMapUnit) => obj.countryName === countryName, indicatorData));
    }

    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }
    public getUnbundlingAid(args: DH.IUnbundlingAidQuery): Promise<any> {

    }
}

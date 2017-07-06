import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {IRAW, getIndicatorDataSimple, getTotal, indicatorDataProcessing} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import sql, {DAC} from './sql';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    DACOnly: boolean;
}

export default class Maps {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(name =>
            R.find((obj: DH.IMapUnit) => obj.name === name, indicatorData));
    }

    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IMapData> {
         try {
             const concept: IConcept = await getConceptAsync('global-picture', opts.id);
             // we merge concept and graphql qery options, they have startYear and endYear variables
             const data: IRAW [] = await getIndicatorDataSimple<IRAW>({...concept, sql, db: this.db, table: opts.id});
             const DACCountries = opts.DACOnly ? await this.getDACCountries() : [];
             const processedData: DH.IMapUnit[] = await indicatorDataProcessing(data);
             const mapData = DACCountries.length ? Maps.DACOnlyData(DACCountries, processedData) : processedData;
             const total: number = getTotal(mapData);
             return {map: mapData, total, ...concept};
         } catch (error) {
             console.error(error);
             throw error;
         }
    }

    private async getDACCountries(): Promise<string[]> {
        try {
            const donors: Array<{donor_name: string}> = await this.db.manyCacheable(DAC, 'DAC');
            return donors
            .map(donor => donor.donor_name);
        } catch (error) {
            throw error;
        }
    }
}

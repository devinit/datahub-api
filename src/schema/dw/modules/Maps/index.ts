import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getTotal, indicatorDataProcessing, getCurrentYear} from '../../../../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import sql from './sql';
import {isNumber} from '../../../../lib/isType';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    startYear: number;
    endYear: number;
    DACOnly: boolean;
}

export default class Maps {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(countryName =>
            R.find((obj: DH.IMapUnit) => obj.countryName === countryName, indicatorData));
    }

    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IAggregatedMap> {
        const concept: IConcept = await getConceptAsync('global-picture', opts.id);
        // we merge concept and graphql qery options, they have startYear and endYear variables
        const data: any [] = await this.getIndicatorData({...opts, ...concept});
        const DACCountries = opts.DACOnly ? await this.getDACCountries() : [];
        const processedData = await indicatorDataProcessing(data);
        const mapData = DACCountries.length ? Maps.DACOnlyData(DACCountries, processedData) : processedData;
        const total: number = getTotal(mapData);
        return {map: mapData, total, ...concept};
    }

    private async getDACCountries(): Promise<string[]> {
        const donors: Array<{donor_name: string}> = await this.db.manyCacheable(sql.DAC, 'DAC');
        return donors
            .map(donor => donor.donor_name);
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        const endYear = !isNumber(opts.endYear) ? getCurrentYear() : opts.endYear;
        return this.db.manyCacheable(sql.indicator, {...opts, endYear});
    }
}

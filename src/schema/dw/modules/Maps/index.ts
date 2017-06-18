import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getTotal, toId, IhasDiId, toNumericValue, addCountryName, getCurrentYear} from '../../../../utils';
import {IEntity, getEntities} from '../../../cms/modules/global';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {isNumber} from '../../../../lib/isType';
// import {ICms} from '../../../cms';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    startYear: number;
    endYear: number;
    DACOnly: boolean;
}
interface IProcessArgs {
    data: IhasDiId[];
    entities: IEntity[];
    DACCountries: string[];
}
export default class Maps {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(countryName =>
            R.find((obj: DH.IMapUnit) => obj.countryName === countryName, indicatorData));
    }

    public static process({data, entities, DACCountries}: IProcessArgs): DH.IMapUnit[] {
        const indicatorData = data
            .map(toId)
            .map((obj) => addCountryName(obj, entities))
            .map(toNumericValue) as DH.IMapUnit[];
        return DACCountries.length ? Maps.DACOnlyData(DACCountries, indicatorData) : indicatorData;
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
        const entities = await getEntities();
        const mapData: DH.IMapUnit[] = Maps.process({data, entities, DACCountries});
        const total: number = getTotal(mapData);
        return {map: mapData, total, ...concept};
    }

    private async getDACCountries(): Promise<string[]> {
        const donors: Array<{donor_name: string}> = await this.db.manyCacheable(this.createDACQuery(), 'DAC');
        return donors
            .map(donor => donor.donor_name);
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        const endYear = !isNumber(opts.endYear) ? getCurrentYear() : opts.endYear;
        return this.db.manyCacheable(this.createIndicatorQuery(), {...opts, endYear});
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.${id^} WHERE year >= ${startYear} AND year <= ${endYear}';
    }
    private createDACQuery() {
        return 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';
    }
}

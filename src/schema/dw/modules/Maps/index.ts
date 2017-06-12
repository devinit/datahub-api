import {IDatabase} from 'pg-promise';
import {getTotal} from 'utils';

interface IgetMapDataOpts {
    indicatorType: string;
    startYear: number;
    endYear: number;
}

export default class Maps {

    private db: IDatabase<any>;

    constructor(db: any) {
        this.db = db;
    }
    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IAggregatedMap> {
        const map: DH.IMapUnit[] = await this.getIndicatorData(opts);
        // console.log('map unit:', map[0]);
        const label: string = opts.indicatorType;
        // TODO: Get unit value from refrence file
        const unit: string = '%';
        const total: number = getTotal(map);
        return {map, label, unit, total};
    }
    public async getDACCountries(): Promise<string[]> {
        const donors: Array<{donor_name: string}> = await this.db.many(this.createDACQuery(), 'DAC');
        return donors
            .map(donor => donor.donor_name);
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        return this.db.any(this.createIndicatorQuery(), opts);
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.${indicatorType^} WHERE year >= ${startYear} AND year <= ${endYear}';
    }
    private createDACQuery(): string {
        return 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';
    }
}

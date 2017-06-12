import {IDatabase} from 'pg-promise';

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
        const label: string = opts.indicatorType;
        const unit: string = '%';
        // TODO: getTotal function
        const total: number = 100;
        return {map, label, unit, total};
    }
    public async getDACCountries(): Promise<string[]> {
        // TODO: post process
        return this.db.many(this.createDACQuery());
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.depth_of_extreme_poverty_190';
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        console.log('opts: ', opts);
        return this.db.any(this.createIndicatorQuery());
    }
    private createDACQuery() {
        return 'SELECT * FROM dimension.iso_3166_1';
    }
}

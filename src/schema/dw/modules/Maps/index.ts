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
        const dac: string[] = await this.getDAC();
        // TODO: getTotal function
        const total: number = 100;
        return {map, label, unit, dac, total};
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.\"${indicatorType}\" WHERE year > ${startYear} AND year < ${endYear}';
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        return this.db.any(this.createIndicatorQuery(), opts);
    }
    private createDACQuery() {
        return 'SELECT * FROM dimension.iso_3166_1';
    }
    private getDAC(): Promise<string[]> {
        // TODO: post process
        return this.db.many(this.createDACQuery());
    }

}

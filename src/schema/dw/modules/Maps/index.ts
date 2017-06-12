import {IDatabase} from 'pg-promise';
import {getTotal} from '../../../../utils';


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
        const total: number = getTotal(map);
        return {map, label, unit, dac, total};
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.\"${indicatorType}\" WHERE year > ${startYear} AND year < ${endYear}';
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        return this.db.any(this.createIndicatorQuery(), opts);
    }
    private createDACQuery(): string {
        return 'SELECT * FROM dimension.iso_3166_1';
    }
    private async getDAC(): Promise<string[]> {
        // TODO: post process
        const data: Array<{id: string}> = await this.db.many(this.createDACQuery());
        return data.map(obj => obj.id);
    }

}

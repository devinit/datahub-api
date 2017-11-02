import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getOverViewTabRegional} from './lib/utils';
import Uganda from './lib/uganda';
import Kenya from './lib/kenya';

export default class SpotLight {
    public uganda: Uganda;
    public kenya: Kenya;
    public getOverViewTabRegional: (any) => Promise<DH.IOverviewTabRegional>;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.uganda = new Uganda(db);
        this.kenya = new Kenya(db);
        this.getOverViewTabRegional = getOverViewTabRegional;
    }
}

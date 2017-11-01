import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import Uganda from './lib/uganda';
import Kenya from './lib/kenya';

export default class SpotLight {
    public uganda: Uganda;
    public kenya: Kenya;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.uganda = new Uganda(db);
        this.kenya = new Kenya(db);
    }
}

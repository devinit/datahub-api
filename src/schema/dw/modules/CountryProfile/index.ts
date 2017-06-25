import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import OverViewTab from './OverViewTab';

export default class CountryProfile {
    public overViewTab: OverViewTab;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.overViewTab = new OverViewTab(db);
    }
}

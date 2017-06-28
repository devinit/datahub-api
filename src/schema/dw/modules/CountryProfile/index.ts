import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import CountryProfileTabs from './CountryProfileTabs';
import Resources from './Resources';

export default class CountryProfile {
    public tabs: CountryProfileTabs;
    public resources: Resources;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.tabs = new CountryProfileTabs(db);
        this.resources = new Resources(db);
    }
}

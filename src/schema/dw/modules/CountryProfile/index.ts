import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import CountryProfileTabs from './CountryProfileTabs';

export default class CountryProfile {
    public tabs: CountryProfileTabs;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.tabs = new CountryProfileTabs(db);
    }
}

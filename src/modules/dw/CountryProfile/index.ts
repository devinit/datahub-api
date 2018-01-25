import {IDB} from '@devinit/graphql-next/lib/db';
import CountryProfileTabs from './CountryProfileTabs';
import Resources from './Resources';

export default class CountryProfile {
    public tabs: CountryProfileTabs;
    public resources: Resources;
    constructor(db: IDB) {
        this.tabs = new CountryProfileTabs(db);
        this.resources = new Resources(db);
    }
}

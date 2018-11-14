import { IDB } from '../../../api/db';
import CountryProfileTabs from './CountryProfileTabs';
import Resources from './Resources';
import { Print } from './Print';
import { RecipientProfiles } from './RecipientProfiles';

export default class CountryProfile {
    public tabs: CountryProfileTabs;
    public resources: Resources;
    public print: Print;
    public recipientProfiles: RecipientProfiles;

    constructor(db: IDB) {
        this.tabs = new CountryProfileTabs(db);
        this.resources = new Resources(db);
        this.print = new Print();
        this.recipientProfiles = new RecipientProfiles(db);
    }
}

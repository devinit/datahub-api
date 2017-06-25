import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import OverViewTab from './OverviewTab';

export default class CountryProfile {
    public overViewTab: OverViewTab;
    constructor(db: IDatabase<IExtensions> & IExtensions) {
        this.overViewTab = new OverViewTab(db);
    }
}

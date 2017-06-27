import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor, IRAW} from '../utils';

export default class CountryProfileTabs {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultDonorArgs;
    private defaultRecipientArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultDonorArgs = {db: this.db, theme: DONOR};
        this.defaultRecipientArgs = {db: this.db, theme: RECIPIENT};
    }
    public async getOverViewTab({id}): Promise<DH.OverViewTab> {
        const IsDonor =  await isDonor(id);
        if (IsDonor) return this.getOverViewTabDonors(id);
        return this.getOverViewTabRecipients(id);
    }
}

 // tslint:disable-next-line:no-reference
 /// <reference path="../../../../types/dh.d.ts" />
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor, IRAW} from '../utils';

interface IflowTypes {
    inflows: DH.IFlow[];
    outflows: DH.IFlow[];
}
interface ISingleResourceArgs {
    resourceId: string;
    countryId: string;
    direction: string;
    groupById: string;
}
export default class Resources {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultDonorArgs;
    private defaultRecipientArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultDonorArgs = {db: this.db, theme: DONOR};
        this.defaultRecipientArgs = {db: this.db, theme: RECIPIENT};
    }
    public async getInternationalResources({id}): Promise<any> {
        const isDonorCountry =  await isDonor(id);
        const netODAOfGNIIn = isDonorCountry ? null : await this.getNetODAOfGNIIn(id);
        const netODAOfGNIOut = isDonorCountry ? await this.getNetODAOfGNIOut(id) : null;
        const GNI = this.getGNI(id);
        const {outflows, inflows}  = await this.getFlows(id);
        const resourcesOverTime = await this.getResourcesOverTime(id);
        const mixOfResources = await this.getMixOfResources(id);
        return {
            GNI,
            netODAOfGNIIn,
            netODAOfGNIOut,
            resourcesOverTime,
            mixOfResources,
            inflows,
            outflows
        };
    }
    // internation resource
    public async getSingleResource({resourceId, countryId, direction}: ISingleResourceArgs):
        Promise<DH.ISingleResourceData> {
    }
    // TODO: check if entity hasDomestic data from entity file before making any request
    public async getGovernmentFinance(id: string): Promise<DH.IGovernmentFinance>{
        
    }
    private async getGNI(id: string): Promise<string> {}
    private async getNetODAOfGNIIn(id: string): Promise<number> {}
    private async getNetODAOfGNIOut(id: string): Promise<number> {}
    private async getFlows(id: string): Promise<IflowTypes> {}
    private async getResourcesOverTime(id: string): Promise<DH.IResourceData[]> {}
    private async getMixOfResources(id: string): Promise<DH.IIndicatorData[]> {}
}

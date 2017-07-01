 // tslint:disable-next-line:no-reference
 /// <reference path="../../../../types/dh.d.ts" />
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs,
        indicatorDataProcessingSimple, getTotal, makeSqlAggregateRangeQuery,
        isDonor, IRAW, IRAWFlow, IProcessedSimple, entitesFnMap, formatNumber} from '../utils';
import {
    getFlowByTypeAsync,
    getFlowByIdAsync,
    getAllFlowSelections,
    IFlowRaw,
    IFlowSelectionRaw} from '../../../cms/modules/countryProfile';

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
    private defaultArgs;

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
    public async getSingleResource(opts: ISingleResourceArgs): Promise<DH.ISingleResourceData> {
        const {resourceId, countryId, groupById} = opts;
        // get flow resoure entity
        const flow: IFlowRaw =  await getFlowByIdAsync(resourceId);
        const concept: IConcept = await getConceptAsync('country-profile', flow.id);
        let args = {
            years: [concept.startYear, concept.endYear],
        };
        if (flow.donorRecipientType === DONOR) args = {...args, di_id_from: countryId};
        if (flow.donorRecipientType === RECIPIENT) args = {...args, di_id_to: countryId};
        if (flow.id === 'data_series.intl_flows_recipients' || flow.id === 'data_series.intl_flows_donors') {
            args = {...args, flow_name: resourceId};
        }
        const sqlQuery = makeSqlAggregateRangeQuery(args, groupById, flow.id);
        const data: IRAW[] = await this.db.manyCacheable(sqlQuery, null);
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
        const entities = entitesFnMap[groupById]();
        // TODO: write extensive tests
        const resources = processedData.map(obj => {
            const entity = R.find(R.propEq(groupById, obj.id), entities) as  {name: string};
            return {...obj, name: entity.name };
        });
        const total =  R.compose(formatNumber, getTotal)(resources) as string;
        return {
            resources,
            color: flow.color,
            total
        };
    }

    public async getGovernmentFinance(id: string): Promise<DH.IGovernmentFinance>{}

    private async getGNI(id: string): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'fact.gni_usd_2015',
            query: sql.GNI,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return formatNumbers(Number(data[0].value), 1);
    }
    private async getNetODAOfGNIIn(id: string): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'fact.in_oda_net_2015',
            query: sql.ODANetIn,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getNetODAOfGNIOut(id: string): Promise<number> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'fact.in_oda_net_2015',
            query: sql. ODANetOut,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getFlows(id: string): Promise<IflowTypes> {
        // find out whether donor or not using isDonor
        const countryType = isDonor(id) ? DONOR : RECIPIENT;
        const flows: IFlowRaw[] = await getFlowByTypeAsync(countryType);
        const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
        return flows.reduce ((flowTypes: any, flow) => {
            const selections = flowSelections
                .filter(selection => selection.id === flow.id)
                .map(obj => ({id: obj.groupById, name: obj.name}));
            const obj = {name: flow.name, id: flow.id, selections};
            if (flow.direction === 'in') {
                return flowTypes.inflows.push(obj);
            }
            return  flowTypes.outflows.push(obj);
        }, {inflows: [], outflows: []}) as IflowTypes;
    }
    private async getResourcesOverTime(id: string): Promise<DH.IResourceData[]> {
      let countryType = '';
      let resourceSql = '';
      if (isDonor(id)) {
        countryType = DONOR;
        resourceSql = sql.resourcesDonors;
      } else {
        countryType = RECIPIENT;
        resourceSql = sql.resourcesRecipient;
      }
      const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            table: 'data_series.intl_flows_donors',
            query: sql.resourcesDonors,
            id
        };
      const data: IRAWFlow[] = await getIndicatorData<IRAWFlow>(indicatorArgs);
      return Number(data[0].value);
    }
    private async; getMixOfResources(id: string);: Promise<DH.IIndicatorData[]> {

    };
}

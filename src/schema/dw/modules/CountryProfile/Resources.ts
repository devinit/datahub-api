 // tslint:disable-next-line:no-reference
 /// <reference path="../../../../types/dh.d.ts" />
import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {ICurrency, getCurrency, getEntityBySlugAsync, IEntity} from '../../../cms/modules/global';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs,
        indicatorDataProcessingSimple, getTotal, makeSqlAggregateRangeQuery,
        isDonor, IRAW, IRAWFlow, IProcessedSimple, entitesFnMap, IRAWDomestic, domesticDataProcessing} from '../utils';
import {getFlowByTypeAsync, getFlows, getFlowByIdAsync, getBudgetLevels, IBudgetLevelRef,
        getAllFlowSelections, IFlowRef, IFlowSelectionRaw} from '../../../cms/modules/countryProfile';

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
interface IRAWSpending {
    l2: string;
    value: string;
}
interface IFlowProcessed {
  year: number;
  id: string;
  value: number;
  flowType: string;
  flowName: string;
  direction: string;
}

interface IDomesticResourcesOverTime {
    revenueAndGrants: DH.IDomestic[];
    finance: DH.IDomestic[];
    expenditure: DH.IDomestic[];
}

export default class Resources {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultDonorArgs;
    private defaultRecipientArgs;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'country-profile'};
        this.defaultDonorArgs = {...this.defaultArgs, theme: DONOR};
        this.defaultRecipientArgs = {...this.defaultArgs, theme: RECIPIENT};
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
        const flow: IFlowRef =  await getFlowByIdAsync(resourceId);
        const concept: IConcept = await getConceptAsync('country-profile', flow.id);
        let args = {
            years: [concept.startYear, concept.endYear],
        };
        if (flow.donorRecipientType === DONOR) args = {...args, di_id_from: countryId};
        if (flow.donorRecipientType === RECIPIENT) args = {...args, di_id_to: countryId};
        if (flow.id === 'data_series.intl_flows_recipients' || flow.id === 'data_series.intl_flows_donors') {
            args = {...args, flow_name: resourceId};
        }
        const sqlQuery = makeSqlAggregateRangeQuery(args, groupById, flow.concept);
        const data: IRAW[] = await this.db.manyCacheable(sqlQuery, null);
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
        const entities = entitesFnMap[groupById]();
        // TODO: write extensive tests
        const resources = processedData.map(obj => {
            const entity = R.find(R.propEq(groupById, obj.id), entities) as  {name: string};
            return {...obj, name: entity.name };
        });
        const total =  R.compose(formatNumbers, getTotal)(resources) as string;
        return {
            resources,
            color: flow.color,
            total
        };
    }

    public async getGovernmentFinance(id: string): Promise<DH.IGovernmentFinance> {
        const currencyCode = await this.getCurrencyCode(id);
        const totalRevenue = await this.getTotalRevenue(id);
        const grantsAsPcOfRevenue = await this.getGrantsAsPcOfRevenue(id);
        const spendingAllocation = await this.getSpendingAllocation(id);
        const domestic = await this.getDomesticResourcesOvertime(id);
        return {
            totalRevenue,
            grantsAsPcOfRevenue,
            spendingAllocation,
            currencyCode,
            ...domestic
        };
    }
    private async getCurrencyCode(id: string): Promise<string> {
        const currencyList: ICurrency[] = await getCurrency();
        const entity: IEntity = await getEntityBySlugAsync(id);
        const currency = R.find(R.propEq('id', entity.id), currencyList) as ICurrency;
        return currency.code;
    }
    private async getDomesticResourcesOvertime(id: string): Promise<IDomesticResourcesOverTime> {
        const indicatorArgs: IGetIndicatorArgs[] = ['financing', 'total-expenditure', 'total-revenue-and-grants']
            .map(level => ({
                ...this.defaultRecipientArgs,
                l1: level,
                query: sql.domesticResourcesOverTime,
                id
            }));
        const resourcesRaw: IRAWDomestic[][]  =
            await Promise.all(indicatorArgs.map((args) => getIndicatorData<IRAWDomestic>(args)));
        const resources: DH.IDomestic[][] = resourcesRaw.map(domesticDataProcessing);
        return {
            finance: resources[0],
            revenueAndGrants: resources[1],
            expenditure: resources[2]};
    }

    private async getSpendingAllocation(id: string): Promise<DH.ISpendingAllocation[]> {
        const indicatorArgsGdp: IGetIndicatorArgs = {
            ...this.defaultRecipientArgs,
            query: sql.spendingAllocation,
            id
        };
        const data: IRAWSpending[] = await getIndicatorData<IRAWSpending>(indicatorArgsGdp);
        const budgetRefs: IBudgetLevelRef[] = await getBudgetLevels();
        return data.map(obj => {
            const level = R.find(R.propEq('id', obj.l2), budgetRefs) as IBudgetLevelRef;
            return {value: Number(obj.value), ...level};
        });
    }

    private async getTotalRevenue(id: string): Promise<string> {
        const indicatorArgsGdp: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.gdp,
            id
        };
        const gdp: IRAW[] = await getIndicatorData<IRAW>(indicatorArgsGdp);
        if (gdp[0].value) return formatNumber(Number(gdp[0].value), 1);
        return 'No data';
    }
    private async getGrantsAsPcOfRevenue(id: string): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs[] = [sql.totalDomesticRevenueAndGrants, sql.grants]
            .map(query => ({query, ...this.defaultRecipientArgs, id}));
        const totalRevenueAndGrants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[0]);
        const grants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[1]);
        if (totalRevenueAndGrants[0].value && grants[0].value) {
            const pc = (Number(grants[0].value) / Number(totalRevenueAndGrants[0].value)) * 100;
            return pc.toFixed(2);
        }
        return 'No data';
    }

    private async getGNI(id: string): Promise<string> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
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
            query: sql. ODANetOut,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
        return Number(data[0].value);
    }
    private async getFlows(id: string): Promise<IflowTypes> {
        // find out whether donor or not using isDonor
        const countryType = isDonor(id) ? DONOR : RECIPIENT;
        const flows: IFlowRef[] = await getFlowByTypeAsync(countryType);
        const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
        return flows.reduce ((flowTypes: any, flow) => {
            const selections = flowSelections
                .filter(selection => selection.id === flow.id)
                .map(obj => ({id: obj.groupById, name: obj.name}));
            const obj = {...flow, selections};
            if (flow.direction === 'in') return flowTypes.inflows.push(obj);
            return flowTypes.outflows.push(obj);
        }, {inflows: [], outflows: []}) as IflowTypes;
    }
    private async getResourcesOverTime(id: string): Promise<DH.IResourceData[]> {
        const sqlQuery = isDonor(id) ? sql.resourcesDonors : sql.resourcesRecipient;
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sqlQuery,
            id,
            theme: isDonor(id) ? DONOR : RECIPIENT
        };
        const data: IRAWFlow[] = await getIndicatorData<IRAWFlow>(indicatorArgs);
        return this.processResourceData(data);
    }
    private async getMixOfResources(id: string): Promise<DH.IResourceData[]> {
        const sqlQuery = isDonor(id) ? sql.resourcesDonorsMix : sql.resourcesRecipientMix;
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sqlQuery,
            id,
            theme: isDonor(id) ? DONOR : RECIPIENT
        };
        const data: IRAWFlow[] = await getIndicatorData<IRAWFlow>(indicatorArgs);
        return this.processResourceData(data);
    }
    private async processResourceData(data: IRAWFlow[]): Promise<DH.IResourceData[]> {
        const processed: IFlowProcessed[] = indicatorDataProcessingSimple<IFlowProcessed>(data);
        const flows: IFlowRef[] = await getFlows();
        return processed.map(obj => {
            const flow = R.find(R.propEq('id', obj.flowName), flows) as IFlowRef;
            return {...obj, ...flow};
        });
    }
}

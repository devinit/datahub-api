import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {ICurrency, getCurrency, getEntityBySlugAsync, IEntity} from '../../../cms/modules/global';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs,
        indicatorDataProcessingSimple, makeSqlAggregateQuery,
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
  flow_type: string;
  flow_name: string;
  direction: string;
}

interface IDomesticResourcesOverTime {
    revenueAndGrants: DH.IDomestic[];
    finance: DH.IDomestic[];
    expenditure: DH.IDomestic[];
}

export default class Resources {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'country-profile'};
    }
    public async getInternationalResources({id}): Promise<DH.IInternationalResources> {
        try {
            const isDonorCountry =  await isDonor(id);
            const netODAOfGNIOut = isDonorCountry ? await this.getNetODAOfGNIOut(id) : null;
            const GNI = await this.getGNI(id);
            const netODAOfGNIIn = isDonorCountry ? null : await this.getNetODAOfGNIIn(id, Number(GNI));
            const {outflows, inflows}  = await this.getFlows(id);
            const resourcesSql = isDonorCountry ? [sql.resourcesDonors, sql.resourcesDonorsMix] :
            [sql.resourcesRecipient, sql.resourcesRecipientMix];
            const [resourcesOverTime, mixOfResources] = await this.getResourcesGeneric(id, resourcesSql);
            return {
            GNI,
            netODAOfGNIIn,
            netODAOfGNIOut,
            resourcesOverTime,
            mixOfResources,
            inflows,
            outflows
          };
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    // international resource
    public async getSingleResource(opts: ISingleResourceArgs): Promise<DH.ISingleResourceData> {
        try {
            const {resourceId, countryId, groupById} = opts;
            // get flow resoure entity
            const flow: IFlowRef =  await getFlowByIdAsync(resourceId);
            const concept: IConcept = await getConceptAsync('country-profile', flow.concept);
            let args = {years: [concept.start_year, concept.end_year]};
            if (flow.type === DONOR) args = {...args, from_di_id: countryId};
            if (flow.type === RECIPIENT) args = {...args, to_di_id: countryId };
            // tslint:disable-next-line:max-line-length
            if (flow.concept === 'data_series.intl_flows_recipients' || flow.concept === 'data_series.intl_flows_donors') {
                args = {...args, flow_name: resourceId};
            }
            const sqlQuery = makeSqlAggregateQuery(args, groupById, flow.concept);
            const data: IRAW[] = await this.db.manyCacheable(sqlQuery, null);
            const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
            // TODO: types for  entitesFnMap
            const entities = await entitesFnMap[groupById]();
            const resources = processedData.map(obj => {
            const details: {name: string} | undefined = entities.find(entity => entity.id === obj[groupById]);
            if (!details) throw Error('Error finding resource entity details');
            return {...obj, ...details};
        });
            return {
            resources,
            color: flow.color,
        };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }

    public async getGovernmentFinance({id}): Promise<DH.IGovernmentFinance> {
        try {
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
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    private async getCurrencyCode(id: string): Promise<string> {
        try {
            const currencyList: ICurrency[] = await getCurrency();
            const entity: IEntity | undefined = await getEntityBySlugAsync(id);
            if (!entity) throw new Error(`currency code entity was not found for id: ${id}`);
            const currency = R.find(R.propEq('id', entity.id), currencyList) as ICurrency;
            return currency.code;
       } catch (error) {
           throw error;
       }
    }
    private async getDomesticResourcesOvertime(id: string): Promise<IDomesticResourcesOverTime> {
        try {
            const indicatorArgs: IGetIndicatorArgs[] = ['financing', 'total-expenditure', 'total-revenue-and-grants']
            .map(level => ({
                ...this.defaultArgs,
                l1: level,
                query: sql.domesticResourcesOverTime,
                id
            }));
            const resourcesRaw: IRAWDomestic[][]  =
            await Promise.all(indicatorArgs.map((args) => getIndicatorData<IRAWDomestic>(args)));
            const resources: DH.IDomestic[][] = await Promise.all(resourcesRaw.map(obj => domesticDataProcessing(obj)));
            return {
            finance: resources[0],
            expenditure: resources[1],
            revenueAndGrants: resources[2],
            };
        } catch (error) {
            throw error;
        }
    }

    private async getSpendingAllocation(id: string): Promise<DH.ISpendingAllocation[]> {
        try {
            const indicatorArgsGdp: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.spendingAllocation,
            id
        };
            const data: IRAWSpending[] = await getIndicatorData<IRAWSpending>(indicatorArgsGdp);
            const budgetRefs: IBudgetLevelRef[] = await getBudgetLevels();
            return data.map(obj => {
            const level = R.find(R.propEq('id', obj.l2), budgetRefs) as IBudgetLevelRef;
            return {value: Number(obj.value), ...level};
        });
       } catch (error) {
           throw error;
       }
    }

    private async getTotalRevenue(id: string): Promise<string> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.gdp,
            id
           };
            const gdp: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            return formatNumbers(gdp[0].value, 1);
        } catch (error) {
           throw error;
        }
    }
    private async getGrantsAsPcOfRevenue(id: string): Promise<string> {
        try {
            const indicatorArgs: IGetIndicatorArgs[] = [sql.totalDomesticRevenueAndGrants, sql.grants]
                .map(query => ({query, ...this.defaultArgs, id}));
            const totalRevenueAndGrants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[0]);
            const grants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[1]);
            if (totalRevenueAndGrants[0].value && grants[0].value) {
            const pc = (Number(grants[0].value) / Number(totalRevenueAndGrants[0].value)) * 100;
            return pc.toFixed(2);
        }
            return 'No data';
        } catch (error) {
            throw error;
        }
    }

    private async getGNI(id: string): Promise<string> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.GNI,
            id
        };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            return formatNumbers(Number(data[0].value), 1);
        } catch (error) {
            throw error;
        }
    }
    private async getNetODAOfGNIIn(id: string, gni: number): Promise<string> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.ODANetIn,
                id
                };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            if (!data[0].value) return 'No data';
            if (!gni) return 'No data';
            return ((Number(data[0].value) / gni) * 100).toFixed(2);
        } catch (error) {
            throw error;
        }
    }
    private async getNetODAOfGNIOut(id: string): Promise<string> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.ODANetOut,
                id
            };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            return data[0].value ? Number(data[0].value).toFixed(1) : 'No data';
        } catch (error) {
            throw error;
        }
    }
    private async getFlows(id: string): Promise<IflowTypes> {
        // find out whether donor or not using isDonor
        try {
            const countryType = isDonor(id) ? DONOR : RECIPIENT;
            const flows: IFlowRef[] = await getFlowByTypeAsync(countryType);
            const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
            return flows.reduce((flowTypes: IflowTypes, flow) => {
            const selections = flowSelections
                .filter(selection => selection.id === flow.id)
                .map(selection => ({id: selection.group_by_id, name: selection.name}));
            const obj = {name: flow.flow_name, id: flow.id, selections};
            if (flow.direction === 'in') flowTypes.inflows.push(obj);
            if (flow.direction === 'out') flowTypes.outflows.push(obj);
            return flowTypes;
         }, {inflows: [], outflows: []});
       } catch (error) {
           throw error;
       }
    }
     private async getResourcesGeneric(id: string, sqlList: string[]): Promise<DH.IResourceData[][]> {
         try {
             const indicatorArgs: IGetIndicatorArgs[] = sqlList
             .map(query => ({query, ...this.defaultArgs, id}));
             const allRaw: IRAWFlow[][] =
             await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAWFlow>(args)));
             return await Promise.all(allRaw.map(raw => this.processResourceData(raw)));
         } catch (error) {
          throw error;
         }
    }
    private async processResourceData(data: IRAWFlow[]): Promise<DH.IResourceData[]> {
         try {
             const processed: IFlowProcessed[] = indicatorDataProcessingSimple<IFlowProcessed>(data);
             const flowRefs: IFlowRef[] = await getFlows();
             return processed.map(obj => {
             const flow = flowRefs.find(flowRef => flowRef.id === obj.flow_name);
             return {...obj, ...flow};
             });
         } catch (error) {
             throw error;
         }
    }
}

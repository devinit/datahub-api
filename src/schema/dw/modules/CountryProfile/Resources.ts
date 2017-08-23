import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import sql from './sql';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';
import * as shortid from 'shortid';
import {ICurrency, getCurrency, getEntityBySlugAsync, IColor, getFlowType,
        IEntity, getColors, getEntityByIdGeneric, IEntityBasic} from '../../../cms/modules/global';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, CROSSOVER, capitalize,
        indicatorDataProcessingSimple, makeSqlAggregateQuery, formatNumbers, getIndicatorsValue, getIndicatorToolTip,
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
  uid: string;
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
            const netODAOfGNIOutArr = isDonorCountry ?
                await getIndicatorsValue({id, sqlList: [sql.ODANetOut], ...this.defaultArgs}) : null;
            const GNI: number = await this.getGNI(id);
            const gniToolTip = await getIndicatorToolTip({query: sql.GNI, ...this.defaultArgs});
            const netODAOfGNIIn = isDonorCountry ? null : await this.getNetODAOfGNIIn(id, GNI);
            const resourcesSql = isDonorCountry ? [sql.resourcesDonors, sql.InflowsDonors, sql.resourcesDonorsMix] :
            [sql.resourcesRecipient, sql.resourcesRecipientMix];
            const [resourcesOverTime, mixOfResources] = await this.getResourcesGeneric(id, resourcesSql);
            const resourceInflowsOverTime = await this.getResourceInflowOvertime(id);
            // TODO: we are currently getting start year for various viz
            // from data_series.intl_flows_recipients concept /indicator. They shouldb be a better way of doing this.
            const concept: IConcept = await getConceptAsync('country-profile', 'data_series.intl_flows_recipients');
            return {
                GNI: {value: formatNumbers(GNI, 0), toolTip: gniToolTip},
                netODAOfGNIIn,
                netODAOfGNIOut: netODAOfGNIOutArr ? netODAOfGNIOutArr[0] : null,
                resourcesOverTime,
                mixOfResources,
                resourceInflowsOverTime,
                startYear: concept.end_year || 2015
          };
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    // international resource // TODO: reuse process resource data fns refactor
    public async getSingleResource(opts: ISingleResourceArgs): Promise<DH.ISingleResourceData> {
        try {
            const {resourceId, countryId, groupById} = opts;
            // get flow resoure entity
            const flow: IFlowRef =  await getFlowByIdAsync(resourceId);
            const concept: IConcept = await getConceptAsync('country-profile', flow.concept);
            let args: any = {years: [concept.start_year, concept.end_year]};
            if (flow.concept === 'data_series.intl_flows_recipients'
                || flow.concept === 'data_series.intl_flows_donors') {
                args = {...args, flow_name: resourceId, di_id: countryId};
            } else {
                if (flow.type === DONOR) args = {...args, from_di_id: countryId};
                if (flow.type === RECIPIENT) args = {...args, to_di_id: countryId };
            }
            const sqlQuery = makeSqlAggregateQuery(args, groupById, flow.concept);
            // console.log( sqlQuery);
            const data: IRAW[] = await this.db.manyCacheable(sqlQuery, null);
            const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
            // TODO: types for  entitesFnMap
            const entities = await entitesFnMap[groupById]();
            // console.log(entities[0]);
            const colors = await getColors();
            const resources = processedData.map(obj => {
                let details: {name: string} | undefined = entities.find(entity => entity.id === obj[groupById]);
                if (!details) details = {name: obj[groupById]};
                return {...obj, ...details};
            }) as DH.IIndicatorData[];
            const colorObj: IColor = getEntityByIdGeneric<IColor>(flow.color, colors);
            return {
                resources,
                color: colorObj.value,
            };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }

    public async getGovernmentFinance({id}): Promise<DH.IGovernmentFinance> {
        try {
            const isDonorCountry =  await isDonor(id);
            const concept: IConcept = await getConceptAsync('country-profile', 'data_series.domestic');
            if (isDonorCountry) {
                return {
                    totalRevenue: null, grantsAsPcOfRevenue: null, spendingAllocation: null,
                    currencyCode: null, expenditure: null, revenueAndGrants: null, finance: null,
                    startYear: concept.end_year || 2015,
                };
            }
            const currencyCode = await this.getCurrencyCode(id);
            const [totalRevenue] = await getIndicatorsValue({id, sqlList: [sql.domesticRevenue], ...this.defaultArgs});
            const grantsAsPcOfRevenue = await this.getGrantsAsPcOfRevenue(id);
            const spendingAllocation = await this.getSpendingAllocation(id);
            const domestic = await this.getDomesticResourcesOvertime(id);
            return {
                totalRevenue,
                grantsAsPcOfRevenue,
                spendingAllocation,
                currencyCode,
                ...domestic,
                startYear: concept.end_year || 2015
            };
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    public async getFlows(countryType: string): Promise<IflowTypes> {
        // find out whether donor or not using isDonor
        try {
            const type = countryType ===  CROSSOVER ? RECIPIENT : countryType;
            const flows: IFlowRef[] = await getFlowByTypeAsync(type);
            const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
            return flows
                .filter(flow => Number(flow.used_in_area_treemap_chart) === 1)
                .reduce((flowTypes: IflowTypes, flow) => {
                    const selections = flowSelections
                        .filter(selection => selection.id === flow.id)
                        .map(selection => ({id: selection.group_by_id, name: selection.name,
                            unbundle: selection.unbundle === 1}));
                    const obj = {name: flow.flow_name, id: flow.id, selections};
                    if (flow.direction === 'in') flowTypes.inflows.push(obj);
                    if (flow.direction === 'out') flowTypes.outflows.push(obj);
                    return flowTypes;
                }, {inflows: [], outflows: []});
       } catch (error) {
           throw error;
       }
    }
    private async getResourceInflowOvertime(id: string): Promise<DH.IInflowsOverTimeWithToolTip > {
        const isDonorCountry =  await isDonor(id);
        const query = isDonorCountry ? sql.InflowsDonors : sql.InflowsRecipient;
        const queryArgs = {query, ...this.defaultArgs, id};
        const raw: IRAWFlow[] = await getIndicatorData<IRAWFlow>(queryArgs);
        const flowTypeRefs = await getFlowType();
        const colors = await getColors();
        const data: DH.IIndicatorDataColored[] = raw.map(obj => {
            const flow: IEntityBasic | undefined = flowTypeRefs.find(ref => ref.id === obj.flow_type);
            if (!flow) throw new Error(`No flow type refrence for ${obj.flow_type}`);
            const colorObj: IColor | undefined = colors.find(c => c.id === flow.color);
            const color = colorObj ? colorObj.value : 'grey';
            return {name: capitalize(obj.flow_type), value: Number(obj.value), id: obj.flow_type,
                color, uid: shortid.generate(), year: Number(obj.year)};
        });
        const toolTip = await getIndicatorToolTip(queryArgs);
        return {data, toolTip};
    }
    private async getCurrencyCode(id: string): Promise<string> {
        try {
            const currencyList: ICurrency[] = await getCurrency();
            const entity: IEntity | undefined = await getEntityBySlugAsync(id);
            if (!entity) throw new Error(`entity was not found for slug: ${id}`);
            const currency: ICurrency | undefined = R.find(R.propEq('id', entity.id), currencyList) as ICurrency;
            return currency ? currency.code : 'NCU';
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

    private async getSpendingAllocation(id: string): Promise<DH.ISpendingAllocationWithToolTip> {
        try {
            const indicatorArgsGdp: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.spendingAllocation,
            id
        };
            const raw: IRAWSpending[] = await getIndicatorData<IRAWSpending>(indicatorArgsGdp);
            // TODO: we have null names from raw data
            const budgetRefs: IBudgetLevelRef[] = await getBudgetLevels();
            const data = raw
                .filter(obj => obj.l2 !== null)
                .map(obj => {
                    const level = R.find(R.propEq('id', obj.l2), budgetRefs) as IBudgetLevelRef;
                    return {value: Number(obj.value), ...level, uid: shortid.generate()};
                });
            const toolTip = await getIndicatorToolTip(indicatorArgsGdp);
            return {data, toolTip};
       } catch (error) {
           throw error;
       }
    }

    private async getGrantsAsPcOfRevenue(id: string): Promise<DH.IIndicatorValueWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs[] = [sql.totalDomesticRevenueAndGrants, sql.grants]
                .map(query => ({query, ...this.defaultArgs, id}));
            const totalRevenueAndGrants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[0]);
            const grants: IRAW[] =  await getIndicatorData<IRAW>(indicatorArgs[1]);
            let value = 'No data';
            if (totalRevenueAndGrants[0] && totalRevenueAndGrants[0].value && grants[0] && grants[0].value) {
                const pc = (Number(grants[0].value) / Number(totalRevenueAndGrants[0].value)) * 100;
                value = pc.toFixed(1);
            }
            const toolTip = await getIndicatorToolTip(indicatorArgs[1]);
            return {value, toolTip};
        } catch (error) {
            throw error;
        }
    }

    private async getGNI(id: string): Promise<number> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.GNI,
            id
        };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            return Number(data[0].value);
        } catch (error) {
            throw error;
        }
    }
    private async getNetODAOfGNIIn(id: string, gni: number): Promise<DH.IIndicatorValueWithToolTip> {
        try {
            const indicatorArgs: IGetIndicatorArgs = {
                ...this.defaultArgs,
                query: sql.ODANetIn,
                id
            };
            const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            if (!data[0].value || !gni) return { value: 'No data', toolTip};
            const value = ((Number(data[0].value) / gni) * 100).toFixed(1);
            return {value, toolTip};
        } catch (error) {
            throw error;
        }
    }

     private async getResourcesGeneric(id: string, sqlList: string[]): Promise<DH.IResourceDataWithToolTip[]> {
         try {
            const indicatorArgs: IGetIndicatorArgs[] = sqlList
                .map(query => ({query, ...this.defaultArgs, id}));
            const allRaw: IRAWFlow[][] =
                await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAWFlow>(args)));
            return Promise.all(allRaw.map(async (raw, index) => {
                const data = await this.processResourceData(raw);
                const toolTip = await getIndicatorToolTip(indicatorArgs[index]);
                return {data, toolTip};
            }));
         } catch (error) {
          throw error;
         }
    }
    private async processResourceData(data: IRAWFlow[]): Promise<DH.IResourceData[]> {
         try {
            const processed: IFlowProcessed[] = indicatorDataProcessingSimple<IFlowProcessed>(data);
            const flowRefs: IFlowRef[] = await getFlows();
            const colors = await getColors();
            return processed.map(obj => {
                const flow: IFlowRef | undefined = flowRefs.find(flowRef => flowRef.id === obj.flow_name);
                if (flow === undefined) throw new Error(`No flow refrence for ${JSON.stringify(obj)} `);
                const colorObj: IColor = getEntityByIdGeneric<IColor>(flow.color, colors);
                return {...obj, ...flow, color: colorObj.value, flow_id: flow.id} as DH.IResourceData;
             });
         } catch (error) {
             throw error;
         }
    }
}

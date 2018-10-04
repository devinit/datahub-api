import { IDB } from '../../../api/db';
import sql from './sql';
import { IConcept, getConceptAsync } from '../../refs/concept';
import * as R from 'ramda';
import * as shortid from 'shortid';
import { IColor, IEntityBasic, getColors, getEntityByIdGeneric, getFlowType } from '../../refs/global';
import { IGetIndicatorArgs, IProcessedSimple, IRAW, IRAWDomestic, IRAWFlow } from '../../utils/types';
import {
  CROSSOVER, DONOR, RECIPIENT, domesticDataProcessing, entitesFnMap,
  getCurrencyCode, getIndicatorData, getIndicatorToolTip, getIndicatorsValue,
  indicatorDataProcessingSimple, isDonor, makeSqlAggregateQuery
} from '../../utils';
import {
  IBudgetLevelRef, IFlowRef, IFlowSelectionRaw, getAllFlowSelections, getBudgetLevels,
  getFlowByIdAsync, getFlowByTypeAsync, getFlows
} from '../../refs/countryProfile';
import { approximate, capitalize, getMaxAndMin, getTotal } from '@devinit/prelude';

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
  budget_type: string;
  value: string | number;
}
interface IFlowProcessed {
  year: number;
  id: string;
  value: number;
  uid: string;
  flow_category_order: number;
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
  private db: IDB;
  private defaultArgs;

  public static getMaxYear(data: Array<{ year?: number | null }>): number {
    const years = data.map(obj => Number(obj.year));

    return Math.max.apply(null, years);
  }
  // FIXME: This may not be necessary, category order alone maybe enough
  public static getFlowPositions = (flowRefs: IFlowRef[]) => (flow: IFlowRef): number => {
    const directionGroups = R.groupBy<IFlowRef>(R.prop('direction'), flowRefs);
    const sorted = directionGroups[flow.direction]
      .filter(obj => Number(obj.flow_category_order) > 0)
      .sort((a, b) => a.flow_category_order - b.flow_category_order);
    const [ typePos, catPos ] = [ 'flow_type', 'flow_category' ].map(cat => {
      const uniqs = R.uniq(sorted.map(obj => obj[cat]));

      return R.findIndex(val => val === flow[cat], uniqs);
    });

    // add plus 1 to make non zero indexed
    return Number(`${typePos + 1}${catPos + 1}${flow.flow_category_order}`);
  }

  constructor(db: IDB) {
    this.db = db;
    this.defaultArgs = { db: this.db, conceptType: 'country-profile' };
  }

  public async getInternationalResources({ id }): Promise<DH.IInternationalResources> {
    try {
      const isDonorCountry = await isDonor(id);
      const netODAOfGNIOutArr = isDonorCountry ?
        await getIndicatorsValue({ id, sqlList: [ sql.ODANetOut ], ...this.defaultArgs }) : null;
      const GNI: number = await this.getGNI(id);
      const gniToolTip = await getIndicatorToolTip({ query: sql.GNI, ...this.defaultArgs });
      const netODAOfGNIIn = isDonorCountry ? null : await this.getNetODAOfGNIIn(id, GNI);
      const resourcesSql = isDonorCountry ? [ sql.resourcesDonors, sql.resourcesDonorsMix ] :
        [ sql.resourcesRecipient, sql.resourcesRecipientMix ];
      const [ resourcesOverTime, mixOfResources ] = await this.getResourcesGeneric(id, resourcesSql);
      const resourceflowsOverTime = await this.getResourceflowsOvertime(id);
      const concept: IConcept = await getConceptAsync('country-profile', 'data_series.intl_flows_recipients');
      const maxYear = resourceflowsOverTime && resourceflowsOverTime.data
        ? getMaxAndMin(resourceflowsOverTime.data)[0]
        : concept.end_year;

      // TODO: we are currently getting start year for various viz
      // from data_series.intl_flows_recipients concept /indicator. They shouldb be a better way of doing this
      return {
        GNI: { value: approximate(GNI, 0), toolTip: gniToolTip },
        netODAOfGNIIn,
        netODAOfGNIOut: netODAOfGNIOutArr ? netODAOfGNIOutArr[0] : null,
        resourcesOverTime,
        mixOfResources,
        resourceflowsOverTime,
        startYear: maxYear && maxYear < concept.end_year ? maxYear : concept.end_year
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // international resource // TODO: reuse process resource data fns refactor
  public async getSingleResource(opts: ISingleResourceArgs): Promise<DH.ISingleResourceData> {
    try {
      const { resourceId, countryId, groupById } = opts;
      // get flow resoure entity
      const flow: IFlowRef = await getFlowByIdAsync(resourceId);
      const concept: IConcept = await getConceptAsync('country-profile', flow.concept);
      let args: any = { years: [ concept.start_year, concept.end_year ] };
      if (flow.concept === 'data_series.intl_flows_recipients'
        || flow.concept === 'data_series.intl_flows_donors') {
        args = { ...args, flow_name: resourceId, di_id: countryId };
      } else {
        if (flow.type === DONOR) { args = { ...args, from_di_id: countryId }; }
        if (flow.type === RECIPIENT) { args = { ...args, to_di_id: countryId }; }
      }
      const sqlQuery = makeSqlAggregateQuery(args, groupById, flow.concept);
      const data: IRAW[] = await this.db.manyCacheable(sqlQuery);
      const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
      // TODO: types for  entitesFnMap
      const entities = await entitesFnMap[groupById]();
      const colors = await getColors();
      const resources = processedData.map(obj => {
        let details: { name: string } | undefined = entities.find(entity => entity.id === obj[groupById]);
        if (!details) { details = { name: obj[groupById] }; }

        return { ...obj, ...details };
      }) as DH.IIndicatorData[];
      const colorObj: IColor = getEntityByIdGeneric<IColor>(flow.color, colors);

      return {
        resources,
        color: colorObj.value || 'grey'
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getGovernmentFinance({ id }): Promise<DH.IGovernmentFinance> {
    try {
      const isDonorCountry = await isDonor(id);
      const concept: IConcept = await getConceptAsync('country-profile', 'data_series.domestic');
      if (isDonorCountry) {
        return {
          totalRevenue: null, grantsAsPcOfRevenue: null, spendingAllocation: null, currencyUSD: null,
          currencyCode: null, expenditure: null, revenueAndGrants: null, finance: null,
          startYear: concept.end_year || 2015
        };
      }
      const currencyCode = await getCurrencyCode(id);
      const [ totalRevenue ] = await getIndicatorsValue(
        { id, sqlList: [ sql.domesticRevenue ], ...this.defaultArgs }
      );
      const grantsAsPcOfRevenue = await this.getGrantsAsPcOfRevenue(id);
      const spendingAllocation = await this.getSpendingAllocation(id);
      const domestic = await this.getDomesticResourcesOvertime(id);
      const maxGovYear = Resources.getMaxYear(domestic.revenueAndGrants);

      return {
        totalRevenue,
        grantsAsPcOfRevenue,
        spendingAllocation,
        currencyCode,
        currencyUSD: 'constant 2016 USD',
        ...domestic,
        startYear: maxGovYear < concept.end_year ? maxGovYear : concept.end_year
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async getFlows(countryType: string): Promise<IflowTypes> {
    // find out whether donor or not using isDonor
    try {
      const type = countryType === CROSSOVER ? RECIPIENT : countryType;
      const flows: IFlowRef[] = await getFlowByTypeAsync(type);
      const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();

      return flows
        .filter(flow => Number(flow.used_in_area_treemap_chart) === 1)
        .reduce((flowTypes: IflowTypes, flow) => {
          const selections = flowSelections
            .filter(selection => selection.id === flow.id)
            .map(selection => ({
              id: selection.group_by_id, name: selection.name,
              unbundle: selection.unbundle === 1
            }));
          const obj = { name: flow.flow_name, id: flow.id, selections };
          if (flow.direction === 'in') { flowTypes.inflows.push(obj); }
          if (flow.direction === 'out') { flowTypes.outflows.push(obj); }
          return flowTypes;
        }, { inflows: [], outflows: [] });
    } catch (error) {
      throw error;
    }
  }
  public async getSpendingAllocation(id: string): Promise<DH.ISpendingAllocationWithToolTip> {
    try {
      const indicatorArgs: IGetIndicatorArgs = {
        ...this.defaultArgs,
        query: sql.spendingAllocation,
        id
      };
      const toolTip = await getIndicatorToolTip({ ...this.defaultArgs, id: 'spending-allocation' });
      const raw: IRAWSpending[] = await getIndicatorData<IRAWSpending>(indicatorArgs);
      if (!raw.length) { return { data: null, toolTip }; }
      // group by budget_type
      const bugdetTypeGroups = R.groupBy<IRAWSpending>(R.prop('budget_type'))(raw);
      const budgetTypes: string[] = R.keys(bugdetTypeGroups);
      if (!budgetTypes) { return { data: null, toolTip }; }
      const activeType = R.contains('actual', budgetTypes) ? 'actual' : budgetTypes[0];
      const activeLevel2s: { [key: string]: IRAWSpending[] } =
        R.groupBy(R.prop('l2'), bugdetTypeGroups[activeType]);
      const refined: IRAWSpending[] = R.keys(activeLevel2s).map(l2 => {
        const value = getTotal(activeLevel2s[l2]);
        return { value, l2, budget_type: activeType };
      });
      const colors: IColor[] = await getColors();
      // TODO: we have null names from raw data
      const budgetRefs: IBudgetLevelRef[] = await getBudgetLevels();
      const data = refined
        .filter(obj => obj.l2 !== null)
        .map(obj => {
          const level = R.find(R.propEq('id', obj.l2), budgetRefs) as IBudgetLevelRef;
          const colorObj = getEntityByIdGeneric(level.color || 'pink', colors);
          return { value: Number(obj.value), ...level, color: colorObj.value, uid: shortid.generate() };
        });
      return { data, toolTip };
    } catch (error) {
      throw error;
    }
  }
  private async getResourceflowsOvertime(id: string): Promise<DH.IFlowsOverTimeWithToolTip> {
    const isDonorCountry = await isDonor(id);
    const query = isDonorCountry ? sql.OutflowsDonors : sql.InflowsRecipient;
    const queryArgs = { query, ...this.defaultArgs, id };
    const raw: IRAWFlow[] = await getIndicatorData<IRAWFlow>(queryArgs);
    const flowTypeRefs = await getFlowType();
    const colors = await getColors();
    const data: DH.IIndicatorData[] = raw.map(obj => {
      const flow: IEntityBasic | undefined = flowTypeRefs.find(ref => ref.id === obj.flow_type);
      if (!flow) {
        throw new Error(`No flow type refrence for ${obj.flow_type}`);
      }
      const colorObj: IColor | undefined = colors.find(c => c.id === flow.color);
      const color = colorObj ? colorObj.value : 'grey';

      return {
        name: capitalize(obj.flow_type), value: Number(obj.value), id: obj.flow_type,
        color, uid: shortid.generate(), year: Number(obj.year)
      };
    });
    const toolTip = isDonorCountry
      ? await getIndicatorToolTip({ ...this.defaultArgs, id: 'resource-outflows' })
      : await getIndicatorToolTip({ ...this.defaultArgs, id: 'resource-inflows' });

    return { data, toolTip };
  }

  private async getDomesticResourcesOvertime(id: string): Promise<IDomesticResourcesOverTime> {
    try {
      const indicatorArgs: IGetIndicatorArgs[] = [ 'financing', 'total-expenditure', 'total-revenue-and-grants' ]
        .map(level => ({
          ...this.defaultArgs,
          l1: level,
          query: sql.domesticResourcesOverTime,
          id
        }));
      const resourcesRaw: IRAWDomestic[][] = await Promise.all(indicatorArgs.map((args) =>
        getIndicatorData<IRAWDomestic>(args))
      );
      const resources: DH.IDomestic[][] = await Promise.all(resourcesRaw.map(obj =>
        domesticDataProcessing(obj))
      );

      return {
        finance: resources[0],
        expenditure: resources[1],
        revenueAndGrants: resources[2]
      };
    } catch (error) {
      throw error;
    }
  }
  private async getGrantsAsPcOfRevenue(id: string): Promise<DH.IIndicatorValueWithToolTip> {
    try {
      const indicatorArgs: IGetIndicatorArgs[] = [ sql.totalDomesticRevenueAndGrants, sql.grants ]
        .map(query => ({ query, ...this.defaultArgs, id }));
      const totalRevenueAndGrants: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs[0]);
      const grants: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs[1]);
      let value = 'No data';
      if (totalRevenueAndGrants[0] && totalRevenueAndGrants[0].value && grants[0] && grants[0].value) {
        const pc = (Number(grants[0].value) / Number(totalRevenueAndGrants[0].value)) * 100;
        value = pc.toFixed(1);
      }
      const toolTip = await getIndicatorToolTip({ id: 'grants-percent-total-revenue', ...this.defaultArgs });
      return { value, toolTip };
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
      if (data && data[0] && data[0].value) { return Number(data[0].value); }
      return 0;
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
      if (!data[0] || !data[0].value || !gni) { return { value: 'No data', toolTip }; }
      if (Number(data[0].value) < 0) { return { value: '0.0', toolTip }; }
      const value = ((Number(data[0].value) / gni) * 100).toFixed(1);
      return { value, toolTip };
    } catch (error) {
      throw error;
    }
  }
  private async getResourcesGeneric(id: string, sqlList: string[]): Promise<DH.IResourceDataWithToolTip[]> {
    try {
      const indicatorArgs: IGetIndicatorArgs[] = sqlList.map(query => ({ query, ...this.defaultArgs, id }));
      const allRaw: IRAWFlow[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAWFlow>(args)));

      return Promise.all(allRaw.map(async (raw, index) => {
        const data = await this.processResourceData(raw);
        const toolTip = await getIndicatorToolTip(indicatorArgs[index]);

        return { data, toolTip };
      }));
    } catch (error) {
      throw error;
    }
  }
  private async processResourceData(data: IRAWFlow[]): Promise<DH.IResourceData[]> {
    try {
      console.log(data);

      const processed: IFlowProcessed[] = indicatorDataProcessingSimple<IFlowProcessed>(data);
      const flowRefs: IFlowRef[] = await getFlows();
      const getPosition = Resources.getFlowPositions(flowRefs);
      const colors = await getColors();

      return processed
        .filter(obj => obj.flow_name && obj.flow_name.length)
        .map(obj => {
          const flow: IFlowRef | undefined = flowRefs.find(flowRef => flowRef.id === obj.flow_name);
          if (flow === undefined) {
            throw new Error(`No flow refrence for ${JSON.stringify(obj)} `);
          }
          const colorObj: IColor = getEntityByIdGeneric<IColor>(flow.color, colors);
          const position = getPosition(flow);

          return { ...obj, ...flow, color: colorObj.value, position, flow_id: flow.id } as DH.IResourceData;
        })
        .sort((a, b) => Number(a.position) - Number(b.position));
    } catch (error) {
      throw error;
    }
  }
}

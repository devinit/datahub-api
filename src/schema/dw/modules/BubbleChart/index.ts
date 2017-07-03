import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import {getConceptAsync, IConcept, getConcepts} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {isError} from '../../../../lib/isType';
import {IEntity, getEntities, getEntityById, getEntityByIdAsync} from '../../../cms/modules/global';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor, IProcessedSimple,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile, getTableNameFromSql,
        indicatorDataProcessingSimple, getTotal, IRAWPopulationGroup, IRAWDomestic,
        domesticDataProcessing, makeSqlAggregateRangeQuery} from '../utils';

interface ISpotlightArgs {
    id: string;
    country: string;
}

interface IRegionalResources {
    regionalResources: string;
    regionalResourcesBreakdown: DH.IIndicatorDataColored[];
}
interface IBubbleSizeResults {
    to_di_id: string;
    value: string;
    year: string;
}

export default class BubbleChart {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'bubble-chart'};
    }

    public async getRevenuePerPerson(): Promise<DH.IBubbleChartOda> {
        const [revenuePerPerson, numberInExtremePoverty] =
            await this.getIndicatorsGeneric([sql.govtRevenuePerPerson, sql.numberInExtremePoverty]);
        return {
            revenuePerPerson,
            numberInExtremePoverty
        };
    }
    public async getBubbleChartPoverty(): Promise<DH.IBubbleChartPoverty> {
        const [revenuePerPerson, percentageInExtremePoverty] =
            await this.getIndicatorsGeneric([sql.govtRevenuePerPerson, sql.percentageInExtremePoverty]);
        return {
            revenuePerPerson,
            percentageInExtremePoverty
        };
    }
    /**
     *
     * @param id: donor country id or indicator table name
     */
    public async getBubbleSize({id}): Promise<DH.IIndicatorData[]> {
        const entities: IEntity[] =  await getEntities();
        const entity = entities.find(obj => obj.id === id);
        if (!entity) return this.getSingleIndicatorGeneric(sql.indicator, id);
        const years = await this.getYears();
        const queryArgs = {from_di_id: id, years};
        const queryStr: string =
                makeSqlAggregateRangeQuery(queryArgs, ' to_di_id', 'fact.oda');
        const raw: IBubbleSizeResults[] = await this.db.manyCacheable(queryStr, null);
        return raw.map(obj => {
            const details = getEntityById(obj.to_di_id, entities);
            return { ...details, value: 2000, year: 2000};
        });
    }

    public async getBubbleChartIndicatorsList(): Promise<DH.IIdNamePair[]> {
        const args = {...this.defaultArgs, query: sql.odaFrom};
        const odaFromRaw: Array<{ from_di_id: string}> = await getIndicatorData<{ from_di_id: string}>(args);
        const entities: IEntity[] =  await getEntities();
        const concepts: IConcept[] = await getConcepts('global-picture');
        const odaFrom = odaFromRaw.map(obj => getEntityById(obj.from_di_id, entities));
        const otherIndicators = concepts.filter(obj => Number(obj.appear_in_bubble_chart) === 1);
        return R.append(odaFrom, otherIndicators);
    }

    private async getSingleIndicatorGeneric(query: string, table: string): Promise<DH.IIndicatorData[]> {
        const args = {...this.defaultArgs, query, table};
        const raw: IRAW[] = await getIndicatorData<IRAW>(args);
        const processed: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(raw);
        const entities: IEntity[] =  await getEntities();
        return processed.map(obj => {
             const entity = getEntityById(obj.id, entities);
             return {...obj, ...entity};
        });
    }
    private async getYears(): Promise<number[]> {
        // we are using the year range for one of the persistent indicators
        // there could be a better way
        const concept: IConcept = await getConceptAsync('bubble-chart-oda',  'data_series.non_grant_revenue_ppp_pc');
        return R.range(concept.startYear, concept.startYear - 10);
    }
    private async getIndicatorsGeneric(sqlList: string[]): Promise<DH.IIndicatorData[][]>  {
        const indicatorArgs: IGetIndicatorArgs[] =
            sqlList.map(query => ({...this.defaultArgs, query}));
        const indicatorRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
        const processed: IProcessedSimple[][]  =
            indicatorRaw.map(data => indicatorDataProcessingSimple<IProcessedSimple>(data));
        const entities: IEntity[] =  await getEntities();
        return processed.map(indicatorData =>
            indicatorData.map(obj => {
             const entity = getEntityById(obj.id, entities);
             return {...obj, ...entity};
        }));
    }
}

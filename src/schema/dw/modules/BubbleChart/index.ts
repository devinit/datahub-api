import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import sql from './sql';
import {getConceptAsync, IConcept, getConcepts} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {IEntity, getEntities, getEntityById} from '../../../cms/modules/global';
import {getIndicatorData, IGetIndicatorArgs, IProcessedSimple, IRAW, getIndicatorDataSimple,
        indicatorDataProcessingSimple, makeSqlAggregateQuery} from '../utils';

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

    public async getBubbleChartOda(): Promise<DH.IBubbleChartOda> {
        try {
            const [revenuePerPerson, numberInExtremePoverty] =
                await this.getIndicatorsGeneric([sql.govtRevenuePerPerson, sql.numberInExtremePoverty], 'oda');
            return {
                revenuePerPerson,
                numberInExtremePoverty
            };
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }
    public async getBubbleChartPoverty(): Promise<DH.IBubbleChartPoverty> {
        try {
            const [revenuePerPerson, percentageInExtremePoverty] =
            await this.getIndicatorsGeneric([sql.govtRevenuePerPerson, sql.percentageInExtremePoverty], 'poverty');
            return {
                revenuePerPerson,
                percentageInExtremePoverty
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /**
     *
     * @param id: donor country id or indicator table name
     */
    public async getBubbleSize({id}): Promise<DH.IBubbleChartData[]> {
        try {
            const entities: IEntity[] =  await getEntities();
            const entity = entities.find(obj => obj.id === id);
            if (!entity) return this.getSingleIndicatorGeneric(sql.indicator, id);
            // if its not an entity its a global picture indicator
            const years = await this.getYears();
            const queryArgs = {from_di_id: id, years};
            // TODO: turn fact oda table into a configurable variable
            const queryStr: string =
                    makeSqlAggregateQuery(queryArgs, 'to_di_id', 'fact.oda_2015');
            const raw: IBubbleSizeResults[] = await this.db.manyCacheable(queryStr, null);
            return raw.map(obj => {
                const details = getEntityById(obj.to_di_id, entities);
                return {...details, value: Number(obj.value), year: Number(obj.year)};
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getBubbleChartIndicatorsList(): Promise<DH.IIdNamePair[]> {
        try {
            const args = {query: sql.odaFrom, db: this.db};
            const odaFromRaw: Array<{ from_di_id: string}> = await getIndicatorDataSimple<{ from_di_id: string}>(args);
            const entities: IEntity[] =  await getEntities();
            const concepts: IConcept[] = await getConcepts('global-picture');
            const odaFrom = odaFromRaw.map(obj => getEntityById(obj.from_di_id, entities));
            const otherIndicators = concepts.filter(obj => Number(obj.appear_in_bubble_chart) === 1);
            return R.append(odaFrom, otherIndicators);
       } catch (error) {
           console.error(error);
           throw error;
       }
    }

    private async getSingleIndicatorGeneric(query: string, table: string): Promise<DH.IBubbleChartData[]> {
        try {
            const [start_year, end_year] = await this.getYears();
            const args = {db: this.db, query, table, start_year, end_year};
            const raw: IRAW[] = await getIndicatorDataSimple<IRAW>(args);
            const processed: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(raw);
            const entities: IEntity[] =  await getEntities();
            return processed.map(obj => {
             const entity = getEntityById(obj.id, entities);
             return {...obj, ...entity};
            });
        } catch (error) {
            throw new Error (`getSingleIndicatorGeneric Bubble chart for $ ${error}`);
        }
    }
    // TODO: clean this up
    private async getYears(): Promise<number[]> {
         try {
             // tslint:disable-next-line:max-line-length
             const concept: IConcept = await getConceptAsync('bubble-chart-oda',  'data_series.non_grant_revenue_ppp_pc');
             if (!concept) throw new Error('failed to get year concept');
             return [Number(concept.start_year), Number(concept.end_year)];
         } catch (error) {
             throw error;
         }
    }
    private async getIndicatorsGeneric(sqlList: string[], bubbleChartType: string): Promise<DH.IBubbleChartData[][]>  {
       try {
            const indicatorArgs: IGetIndicatorArgs[] =
                sqlList.map(query => ({db: this.db, conceptType: `bubble-chart-${bubbleChartType}`, query}));
            const indicatorRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
            const processed: IProcessedSimple[][]  =
                indicatorRaw.map(data => indicatorDataProcessingSimple<IProcessedSimple>(data));
            const entities: IEntity[] =  await getEntities();
            return processed.map(indicatorData =>
                indicatorData.map(obj => {
                const entity = getEntityById(obj.id, entities);
                return {...obj, ...entity};
            }));
       } catch (error) {
            throw error;
       }
    }
}

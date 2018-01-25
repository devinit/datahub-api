import {IDB} from '@devinit/graphql-next/lib/db';
import sql from './sql';
import * as shortid from 'shortid';
import {getConceptAsync, IConcept, getConcepts} from '../../refs/concept';
import {IEntity, getEntities, getEntityByIdGeneric, IEntityBasic,
    getIncomeGroups, getRegional, getColors} from '../../refs/global';
import {getIndicatorData, IGetIndicatorArgs, IProcessedSimple, IRAW, getIndicatorDataSimple,
        indicatorDataProcessingSimple, makeSqlAggregateQuery} from '../../utils';

interface IBubbleSizeResults {
    to_di_id: string;
    value: string;
    year: string;
}
export default class BubbleChart {
    public static async addColorValue(data: IEntityBasic[]): Promise<IEntityBasic[]> {
        const colors = await getColors();
        return data
            .map(obj => {
                const colorObj = colors.find(c => c.id === obj.color);
                if (!colorObj) return {...obj, color: 'grey'};
                return {...obj, color: colorObj.value};
            });
    }
    private db: IDB;

    constructor(db: IDB) {
        this.db = db;
    }

    public async getBubbleChartOda(id?: string): Promise<DH.IBubbleChartOda[]> {
        try {
            const [revenuePerPerson, numberInExtremePoverty] =
                await this.getIndicatorsGeneric([sql.govtRevenuePerPerson, sql.numberInExtremePoverty], 'oda');
            const indicatorData: DH.IBubbleChartData[] | null = id ? await this.getBubbleSize(id) : null;
            return revenuePerPerson.map((obj) => {
                const povertyObj: DH.IBubbleChartData | undefined =  numberInExtremePoverty
                    .find(pov => pov.id === obj.id && pov.year === obj.year);
                const indicatorObj: DH.IBubbleChartData | undefined | null = indicatorData ?
                    indicatorData.find(indicator => indicator.id === obj.id && indicator.year === obj.year)
                    : null;
                return {
                    ...povertyObj,
                    numberInExtremePoverty: povertyObj ? povertyObj.value : null,
                    revenuePerPerson: obj.value,
                     ...obj,
                    value: indicatorObj ? indicatorObj.value : null,
                    year: obj.year
                };
            })
            .filter(obj => obj.numberInExtremePoverty !== null);
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }
    public async getBubbleChartPoverty(id?: string): Promise<DH.IBubbleChartPoverty[]> {
        try {
            const [revenuePerPerson, percentageInExtremePoverty, numberInExtremePoverty] =
                await this.getIndicatorsGeneric([
                    sql.govtRevenuePerPerson, sql.percentageInExtremePoverty, sql.numberInExtremePoverty], 'poverty');
            // console.log(revenuePerPerson[0], percentageInExtremePoverty[0]);
            const indicatorData: DH.IBubbleChartData[] | null = id ? await this.getBubbleSize(id) : null;
            return revenuePerPerson.map((obj: DH.IBubbleChartData) => {
                const povertyObjPc: DH.IBubbleChartData | undefined =  percentageInExtremePoverty
                    .find(pov => pov.id === obj.id && pov.year === obj.year);
                const povertyObj: DH.IBubbleChartData | undefined =  numberInExtremePoverty
                    .find(pov => pov.id === obj.id && pov.year === obj.year);
                const indicatorObj: DH.IBubbleChartData | undefined | null = indicatorData ?
                    indicatorData.find(indicator => indicator.id === obj.id && indicator.year === obj.year)
                    : null;
                return {
                    ...povertyObjPc,
                    percentageInExtremePoverty: povertyObjPc ? povertyObjPc.value : null,
                    numberInExtremePoverty: povertyObj ? povertyObj.value : null,
                    revenuePerPerson: obj.value,
                     ...obj,
                    value: indicatorObj ? indicatorObj.value : null,
                    year: obj.year
                };
            })
            .filter(obj => obj.percentageInExtremePoverty !== null);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getBubbleSize(id: string): Promise<DH.IBubbleChartData[]> {
        try {
            const entities: IEntity[] =  await getEntities();
            const countryEntity = entities.find(obj => obj.id === id);
            // ie its something  data_series.fdi_pp
            if (!countryEntity) return this.getSingleIndicatorGeneric(sql.indicator, id);
            // if its not an entity its a global picture indicator
            const years = await this.getYears();
            const queryArgs = {from_di_id: id, years};
            // TODO: turn fact oda table into a configurable variable
            const queryStr: string =
                    makeSqlAggregateQuery(queryArgs, 'to_di_id', 'fact.oda_2015');
            const raw: IBubbleSizeResults[] = await this.db.manyCacheable(queryStr);
            return raw.map(obj => {
                const entity: IEntity = getEntityByIdGeneric<IEntity>(obj.to_di_id, entities);
                return {name: entity.name, id: entity.id, income_group: entity.income_group, uid: shortid.generate(),
                    region: entity.region, value: Number(obj.value), year: Number(obj.year)
                };
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getBubbleChartOptions(): Promise<DH.IBubbleChartOptions> {
        try {
            const indicators: DH.IIdNamePair[] = await this.getIndicators();
            const incomeGroups = await getIncomeGroups();
            const regionsData = await getRegional();
            const regions = await BubbleChart.addColorValue(regionsData) as DH.IRegion[];
            return {indicators, incomeGroups, regions};
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    private async getIndicators(): Promise<DH.IIdNamePair[]> {
        try {
            const args = {query: sql.odaFrom, db: this.db};
            const odaFromRaw: Array<{ from_di_id: string}> = await getIndicatorDataSimple<{ from_di_id: string}>(args);
            const entities: IEntity[] =  await getEntities();
            const concepts: IConcept[] = await getConcepts('global-picture');
            const odaFrom =
                odaFromRaw.map(obj => getEntityByIdGeneric<IEntity>(obj.from_di_id, entities)) as DH.IIdNamePair[];
            const otherIndicators =
                concepts.filter(obj => Number(obj.appear_in_bubble_chart) === 1) as DH.IIdNamePair[];
            return odaFrom.concat(otherIndicators);
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
             const entity: IEntity = getEntityByIdGeneric<IEntity>(obj.id, entities);
             return {...obj, name: entity.name, id: entity.id, uid: shortid.generate(),
                income_group: entity.income_group, region: entity.region};
            });
        } catch (error) {
            throw new Error (`getSingleIndicatorGeneric Bubble chart for $ ${error}`);
        }
    }
    // TODO: clean this up
    private async getYears(): Promise<number[] > {
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
                    const entity: IEntity = getEntityByIdGeneric<IEntity>(obj.id, entities);
                    return {...obj, name: entity.name, id: entity.id,
                    income_group: entity.income_group, region: entity.region};
            }));
       } catch (error) {
            throw error;
       }
    }
}

import * as R from 'ramda';
import * as shortid from 'shortid';
import { getConceptAsync } from '../../../../cms/modules/concept';
import {IColor, getColors, getEntityByIdGeneric} from '../../../../cms/modules/global';
import {isError} from '../../../../../lib/isType';
import {getDistrictBySlugAsync, IDistrict} from '../../../../cms/modules/spotlight';
import {IBudgetLevelRef, getBudgetLevels} from '../../../../cms/modules/countryProfile';
import {getIndicatorDataSpotlights, ISpotlightGetIndicatorArgs, IRAW, getSpotlightTableName, getCurrencyCode, addSuffix,
        IRAWPopulationGroup, IRAWDomestic, domesticDataProcessing, formatNumbers,
        addColorToDomesticLevels, getIndicatorToolTip, getTotal} from '../../utils';

interface ISpotlightArgs {
    id: string;
    country: string;
    sql?: any;
}

interface IRegionalResources {
    regionalResources: DH.IIndicatorValueNCUWithToolTip;
    regionalResourcesBreakdown: DH.IIndicatorDataColoredWithToolTip[];
}

export const getConceptType = (country: string): string => `spotlight-${country}`;

export const getTableName = (indicator: string, country: string): string =>
        `spotlight_on_${country}_2017.${country}_${indicator}`;

const rankDistrict = (indicatorRaw: IRAW[], districtId: string): string {
        const groupedByValue = R.groupBy(obj => obj.value, indicatorRaw);
        let rank: number = - 1;
        const groupValueKeys =  R.sort((a, b) => Number(b) - Number(a), R.keys(groupedByValue));
        groupValueKeys.forEach((val, index) => {
            const item = groupedByValue[val].find(obj => obj.district_id === districtId);
            if (item) rank = index;
        });
        return rank < 0 ?
            'No data' : addSuffix(rank + 2).toString(); // remember its zero indexed and rank is -1 by default
};
const buildAggregatedLevel = (level: number, datum: DH.IDomestic, acc: DH.IDomestic[]): DH.IDomestic => {
        if (datum.levels === null || !datum.levels) throw new Error('levels missing in budget data');
        let aggregatedLevel: DH.IDomestic | undefined = acc.find(obj =>
            obj.year === datum.year &&
            obj.budget_type === datum.budget_type &&
            obj.levels !== null && datum.levels !== null &&
            // say we are on level 1 expenditure, we will be matching all breakdowns below level 1 under expenditure
            obj.levels.join('') === R.take(level, datum.levels).join('')
        );
        if (!aggregatedLevel) {
            return aggregatedLevel = {
               ...datum,
               uid: shortid.generate(),
               levels: R.take(level, datum.levels)
            };
        }
        aggregatedLevel.value = Number(aggregatedLevel.value) + Number(datum.value);
        aggregatedLevel.value_ncu = Number(datum.value_ncu) + Number(aggregatedLevel.value_ncu);
        return aggregatedLevel;
};
const aggregateResources = (data: DH.IDomestic[], colors: IColor[], budgetRefs: IBudgetLevelRef[]): DH.IDomestic[] => {
       return data.reduce((acc: DH.IDomestic[], datum: DH.IDomestic) => {
            const aggregatedLevels: DH.IDomestic[] =
                [1, 2, 3].map((level) => buildAggregatedLevel(level, datum, acc));
            const accumulated = acc.concat(aggregatedLevels);
            // eliminate duplicates
            return R.uniqBy(obj => obj.uid, accumulated);
        }, [])
        .filter(obj => {
            if (!obj.levels) return false;
            if (obj.levels.length < 3) return true;
            if (obj.levels[2] === obj.levels[1]) return false; // date error
            // if (obj.levels[3] === obj.levels[2]) return false; // data error
            return true;
        })
        .map(obj => {
            if (!obj.levels) return obj;
            const color = addColorToDomesticLevels(obj.levels, budgetRefs, colors);
            return {...obj, color};
        });
};

export const getLocalGovernmentFinance = async ({id, country, sql, startYear}): Promise<DH.ILocalGovernmentFinance> => {
         try {
            const conceptType = getConceptType(country);
            const budgetRefs: IBudgetLevelRef[] = await getBudgetLevels(country);
            const colors: IColor[] = await getColors();
            const indicatorArgs: ISpotlightGetIndicatorArgs[] = ['Expenditure', 'Revenue']
                .map(l1 => ({
                    db: this.db,
                    conceptType,
                    l1,
                    query: sql.localGovernmentFinance,
                    country,
                    id
                }));
            const resourcesRaw: IRAWDomestic[][]  =
                await Promise.all(indicatorArgs.map((args) => getIndicatorDataSpotlights<IRAWDomestic>(args)));

            const resources: DH.IDomestic[][] =
                await Promise.all(resourcesRaw.map(async (data) => {
                    const disaggregated = await domesticDataProcessing(data, country);
                    return aggregateResources(disaggregated, colors, budgetRefs);
                }));
            const currencyCode = await getCurrencyCode(country);
            // const concept: IConcept =
            // await getConceptAsync(conceptType, SpotLight.getTableName('finance', 'uganda'));
            return {
                startYear,
                currencyCode,
                currencyUSD: 'constant 2015 USD',
                revenueAndGrants: resources[1],
                expenditure: resources[0]
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
};

export const getDistrictIndicatorRank =
    async ({country, id}, query: string): Promise<DH.IIndicatorValueWithToolTip> =>  {
        try {
            const conceptType = getConceptType(country);
            const indicatorArgs: ISpotlightGetIndicatorArgs = {db: this.db, conceptType, query, country, id};
            const indicatorRaw: IRAW[] = await getIndicatorDataSpotlights<IRAW>(indicatorArgs);
            const district: IDistrict = await getDistrictBySlugAsync(country, id);
            const value = rankDistrict(indicatorRaw, district.id);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {value, toolTip};
      } catch (error) {
          throw error;
      }
};
export const getRegionalResources = async ({id, country, sql}): Promise<IRegionalResources> => {
        try  {
            const conceptType = getConceptType(country);
            const indicatorArgs: ISpotlightGetIndicatorArgs[] = [sql.lGFResources, sql.crResources, sql.dResources]
                .map(query => ({query, db: this.db, conceptType, id, country}));
            const resourcesRaw: IRAW[][] =
                await Promise.all(indicatorArgs.map(args => getIndicatorDataSpotlights<IRAW>(args)));
            const resourcesSum: {value: number, value_ncu: number} = resourcesRaw
                .reduce((sum: {value: number, value_ncu: number}, data: IRAW[]) => {
                    if (!data[0]) return sum;
                    const value = Number(data[0].value) + sum.value;
                    const value_ncu = Number(data[0].value_ncu) + sum.value_ncu;
                    return {value, value_ncu};
                }, {value: 0, value_ncu: 0});
            const colors: IColor[] = await getColors();
            const resourceWithConceptPromises: Array<Promise<DH.IIndicatorDataColoredWithToolTip>> = indicatorArgs
                .map(async (args: ISpotlightGetIndicatorArgs , index) => {
                    const conceptId = getSpotlightTableName(country, args.query);
                    if (isError(conceptId)) throw conceptId;
                    const conceptArgs = {conceptType, id:  conceptId};
                    const concept = await getConceptAsync(conceptArgs.conceptType, conceptArgs.id);
                    const resource: IRAW = resourcesRaw[index][0];
                    if (!concept.color) throw new Error(`${concept.id} missing required color value`);
                    const colorObj: IColor = getEntityByIdGeneric<IColor>(concept.color, colors);
                    const data = {
                        value: Number(resource.value), id: concept.id, name: concept.name,
                        year: concept.start_year, color: colorObj.value, uid: shortid.generate()
                    };
                    const toolTip = await getIndicatorToolTip(args);
                    return {data, toolTip};
                });
            const resources: DH.IIndicatorDataColoredWithToolTip[] = await Promise.all(resourceWithConceptPromises);
            const regionalResourcesToolTip = await getIndicatorToolTip(indicatorArgs[0]);
            return {
                regionalResources: {
                    value: formatNumbers(resourcesSum.value, 1),
                    value_ncu: formatNumbers(resourcesSum.value_ncu, 1),
                    toolTip: regionalResourcesToolTip
                },
                regionalResourcesBreakdown: resources
            };
         } catch (error) {
             throw error;
         }
};
export const getIndicatorsGeneric = (country: string) =>
    async (id: string, sqlList: string[], format: boolean = true): Promise<DH.IIndicatorValueNCUWithToolTip[]>  => {
        try {
            const conceptType = getConceptType(country);
            const indicatorArgs: ISpotlightGetIndicatorArgs[] =
                sqlList.map(query => ({db: this.db, conceptType, query, id, country}));
            const indicatorRaw: IRAW[][] =
                await Promise.all(indicatorArgs.map(args => getIndicatorDataSpotlights<IRAW>(args)));
            const toolTips: DH.IToolTip[] =
                await Promise.all(indicatorArgs.map(args => getIndicatorToolTip(args)));
            return indicatorRaw.map((data, index) => {
                const toolTip = toolTips[index];
                let value = 'No data';
                let value_ncu = 'No data';
                if (data[0] && data[0].value && format) value = formatNumbers(data[0].value, 1);
                if (data[0] && data[0].value_ncu && format) value_ncu = formatNumbers(data[0].value_ncu, 1);
                if (data[0] && data[0].value && !format) value = data[0].value;
                return {value, value_ncu, toolTip};
            });
      } catch (error) {
          throw error;
      }
};
export const getPopulationDistribution =
    async ({country, id, sql}: ISpotlightArgs): Promise<DH.IPopulationDistributionWithToolTip> => {
        try {
            const conceptType = getConceptType(country);
            const indicatorArgs: ISpotlightGetIndicatorArgs = {
                db: this.db, conceptType,
                query: sql.populationDistribution,
                ...{country, id}
            };
            const raw: IRAWPopulationGroup[] = await getIndicatorDataSpotlights<IRAWPopulationGroup>(indicatorArgs);
            const dataGrouped: DH.IPopulationDistribution[] = raw.reduce((acc: DH.IPopulationDistribution[], row) => {
                const rural = {group: 'rural', value: Number(row.value_rural), year: Number(row.year) };
                const urban = {group: 'urban', value: Number(row.value_urban),  year: Number(row.year) };
                return [...acc, rural, urban];
            }, []);
            const total = getTotal(dataGrouped);
            const data = dataGrouped.map(obj => ({...obj, value: ((obj.value || 0 ) / total ) * 100 }));
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {toolTip, data};
       } catch (error) {
           throw error;
       }
};

import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import sql from './sql';
import * as R from 'ramda';
import * as shortid from 'shortid';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {IColor, getColors, getEntityByIdGeneric} from '../../../cms/modules/global';
import {isError} from '../../../../lib/isType';
import {getDistrictBySlugAsync, IDistrict} from '../../../cms/modules/spotlight';
import {getIndicatorDataSpotlights, ISpotlightGetIndicatorArgs, IRAW, getSpotlightTableName, getCurrencyCode, addSuffix,
        IRAWPopulationGroup, IRAWDomestic, domesticDataProcessing, formatNumbers, getIndicatorToolTip} from '../utils';

interface ISpotlightArgs {
    id: string;
    country: string;
}

interface IRegionalResources {
    regionalResources: DH.IIndicatorValueWithToolTip;
    regionalResourcesBreakdown: DH.IIndicatorDataColoredWithToolTip[];
}

export default class SpotLight {
    public static getConceptType = (country: string): string => `spotlight-${country}`;

    public static getTableName(indicator: string, country: string): string {
        return `spotlight_on_${country}.${country}_${indicator}`;
    }
    public static rankDistrict(indicatorRaw: IRAW[], districtId: string): string {
        const groupedByValue = R.groupBy(obj => obj.value, indicatorRaw);
        let rank: number = - 1;
        const groupValueKeys =  R.sort((a, b) => Number(b) - Number(a), R.keys(groupedByValue));
        groupValueKeys.forEach((val, index) => {
            const item = groupedByValue[val].find(obj => obj.district_id === districtId);
            if (item) rank = index;
        });
        return rank < 0 ?
            'No data' : addSuffix(rank + 2).toString(); // remember its zero indexed and rank is -1 by default
    }
    public static buildAggregatedLevel = (level: number, datum: DH.IDomestic, acc: DH.IDomestic[]): DH.IDomestic => {
        if (datum.levels === null || !datum.levels) throw new Error('levels missing in budget data');
        let aggregatedLevel: DH.IDomestic | undefined = acc.find(obj =>
            obj.year === datum.year &&
            obj.budget_type === datum.budget_type &&
            obj.levels !== null && datum.levels !== null &&
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
    }
    public static aggregateResources(data: DH.IDomestic[]): DH.IDomestic[] {
        const aggregated = data.reduce((acc: DH.IDomestic[], datum: DH.IDomestic) => {
            const aggregatedLevels: DH.IDomestic[] =
                [1, 2, 3].map((level) => SpotLight.buildAggregatedLevel(level, datum, acc));
            const accumulated = acc.concat(aggregatedLevels);
            // eliminate duplicates
            return R.uniqBy(obj => {
                const levels = obj.levels ? obj.levels.join('') : '';
                return `${obj.uid}${obj.budget_type}${levels}${obj.year}`;
            }, accumulated);
        }, []);
        return aggregated.filter(obj => {
            if (!obj.levels) return false;
            if (obj.levels.length < 2) return true;
            if (obj.levels[2] === obj.levels[1]) return false;
            return true;
        });
    }
    private db: IDatabase<IExtensions> & IExtensions;
    constructor(db: any) {
        this.db = db;
    }
    // id eg uganda or kenya
    public async getOverViewTabRegional(opts: ISpotlightArgs): Promise<DH.IOverviewTabRegional> {
        try {
            const regionalResources = await this.getRegionalResources(opts);
            const [poorestPeople, localGovernmentSpendPerPerson] =
                await this.getIndicatorsGeneric(opts, [sql.poorestPeople, sql.localGovernmentSpendPerPerson]);
            return {
                ...regionalResources,
                poorestPeople,
                localGovernmentSpendPerPerson
           };
        } catch (error) {
           console.error(error);
           throw error;
        }
    }
    public async getPopulationTabRegional(opts: ISpotlightArgs): Promise<DH.IPopulationTabRegional> {
        try {
            const [totalPopulation, populationDensity, averageDependencyRatio, allAverageDependencyRatio]
             = await this.getIndicatorsGeneric(opts,
                [sql.totalPopulation, sql.populationDensity,
                sql.averageDependencyRatio, sql.allAverageDependencyRatio]);
            const populationDistribution = await this.getPopulationDistribution(opts);
            return {
            totalPopulation,
            populationDensity,
            populationDistribution,
            averageDependencyRatio,
            allAverageDependencyRatio
           };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getPovertyTabRegional(opts: ISpotlightArgs): Promise<DH.IPovertyTabRegional> {
        try {
            const [poorestPeople, lifeExpectancy, stdOfLiving] =
                await this.getIndicatorsGeneric(opts, [sql.poorestPeople, sql.lifeExpectancy, sql.stdOfLiving]);
            return {
                poorestPeople,
                lifeExpectancy,
                stdOfLiving
            };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getEducationTabRegional(opts: ISpotlightArgs): Promise<DH.IEducationTabRegional> {
         try {
            const [pupilTeacherRatioGovtSchl, pupilTeacherRatioOtherSchl, primaryEducationfunding] =
                await this.getIndicatorsGeneric(opts, [sql.pupilTeacherRatioGovtSchl, sql.pupilTeacherRatioOtherSchl,
                    sql.primaryEducationfunding]);
            const [studentsPassRate] = await this.getIndicatorsGeneric(opts, [sql.studentsPassRate], false);
            const studentsPassDistrictRank = await this.getDistrictIndicatorRank(opts, sql.studentsPassDistrictRank);
            return {
                pupilTeacherRatioGovtSchl,
                pupilTeacherRatioOtherSchl,
                studentsPassRate,
                studentsPassDistrictRank,
                primaryEducationfunding
          };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getHealthTabRegional(opts): Promise<DH.IHealthTabRegional> {
        try {
            const [districtPerformance, treatmeantOfTb] =
                await this.getIndicatorsGeneric(opts, [sql.districtHealthPerformance, sql.treatmeantOfTb]);
            const [healthCareFunding] = await this.getIndicatorsGeneric(opts, [sql.healthCareFunding], true);
            const districtHealthRank = await this.getDistrictIndicatorRank(opts, sql.districtHealthPerformanceRank);
            return {
                districtPerformance,
                districtHealthRank,
                treatmeantOfTb,
                healthCareFunding // Fix me
            };
       }    catch (error) {
           console.error(error);
           throw error;
       }
    }

    public async getLocalGovernmentFinance({id, country}): Promise<DH.ILocalGovernmentFinance> {
         try {
            const conceptType = SpotLight.getConceptType(country);
            const indicatorArgs: ISpotlightGetIndicatorArgs[] = ['expenditure', 'revenue']
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
                    return SpotLight.aggregateResources(disaggregated);
                }));
            const currencyCode = await getCurrencyCode(country);
            const concept: IConcept = await getConceptAsync(conceptType, SpotLight.getTableName('finance', 'uganda'));
            return {
                startYear: concept.end_year || 2015,
                currencyCode,
                revenueAndGrants: resources[1],
                expenditure: resources[0]
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    private async getDistrictIndicatorRank(opts: ISpotlightArgs, query: string)
        : Promise<DH.IIndicatorValueWithToolTip>  {
        try {
            const conceptType = SpotLight.getConceptType(opts.country);
            const indicatorArgs: ISpotlightGetIndicatorArgs = {db: this.db, conceptType, query, ...opts};
            const indicatorRaw: IRAW[] = await getIndicatorDataSpotlights<IRAW>(indicatorArgs);
            const district: IDistrict = await getDistrictBySlugAsync(opts.country, opts.id);
            const value = SpotLight.rankDistrict(indicatorRaw, district.id);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {value, toolTip};
      } catch (error) {
          throw error;
      }
    }
    private async getRegionalResources(opts: ISpotlightArgs): Promise<IRegionalResources> {
        try  {
            const conceptType = SpotLight.getConceptType(opts.country);
            const indicatorArgs: ISpotlightGetIndicatorArgs[] = [sql.lGFResources, sql.crResources, sql.dResources]
                .map(query => ({query, db: this.db, conceptType, ...opts}));
            const resourcesRaw: IRAW[][] =
                await Promise.all(indicatorArgs.map(args => getIndicatorDataSpotlights<IRAW>(args)));
            const resourcesSum: number = resourcesRaw.reduce((sum: number, data: IRAW[]) => {
                if (data[0] && data[0].value) return  Number(data[0].value) + sum;
                return sum;
            }, 0);
            const colors: IColor[] = await getColors();
            const resourceWithConceptPromises: Array<Promise<DH.IIndicatorDataColoredWithToolTip>> = indicatorArgs
                .map(async (args: ISpotlightGetIndicatorArgs , index) => {
                    const conceptId = getSpotlightTableName(opts.country, args.query);
                    if (isError(conceptId)) throw conceptId;
                    const conceptArgs = {conceptType, id:  conceptId};
                    const concept = await getConceptAsync(conceptArgs.conceptType, conceptArgs.id);
                    const resource: IRAW = resourcesRaw[index][0];
                    if (!concept.color) throw new Error(`${concept.id} missing required color value`);
                    const colorObj: IColor = getEntityByIdGeneric<IColor>(concept.color, colors);
                    const data = {value: Number(resource.value), id: concept.id, name: concept.name,
                        year: concept.start_year, color: colorObj.value, uid: shortid.generate()};
                    const toolTip = await getIndicatorToolTip(args);
                    return {data, toolTip};
                });
            const resources: DH.IIndicatorDataColoredWithToolTip[] = await Promise.all(resourceWithConceptPromises);
            const regionalResourcesToolTip = await getIndicatorToolTip(indicatorArgs[0]);
            return {
                regionalResources: {value: formatNumbers(resourcesSum, 1), toolTip: regionalResourcesToolTip},
                regionalResourcesBreakdown: resources
            };
         } catch (error) {
             throw error;
         }
    }
    private async getIndicatorsGeneric(opts: ISpotlightArgs, sqlList: string[], format: boolean = true)
        : Promise<DH.IIndicatorValueWithToolTip[]>  {
        try {
            const conceptType = SpotLight.getConceptType(opts.country);
            const indicatorArgs: ISpotlightGetIndicatorArgs[] =
                sqlList.map(query => ({db: this.db, conceptType, query, ...opts}));
            const indicatorRaw: IRAW[][] =
                await Promise.all(indicatorArgs.map(args => getIndicatorDataSpotlights<IRAW>(args)));
            const toolTips: DH.IToolTip[] =
                await Promise.all(indicatorArgs.map(args => getIndicatorToolTip(args)));
            return indicatorRaw.map((data, index) => {
                const toolTip = toolTips[index];
                let value = 'No data';
                if (data[0] && data[0].value && format) value = formatNumbers(data[0].value, 1);
                if (data[0] && data[0].value && !format) value = data[0].value;
                return {value, toolTip};
            });
      } catch (error) {
          throw error;
      }
    }
    private async getPopulationDistribution(opts: ISpotlightArgs): Promise<DH.IPopulationDistributionWithToolTip> {
        try {
            const conceptType = SpotLight.getConceptType(opts.country);
            const indicatorArgs: ISpotlightGetIndicatorArgs = {
                db: this.db, conceptType,
                query: sql.populationDistribution,
                ...opts
            };
            const raw: IRAWPopulationGroup[] = await getIndicatorDataSpotlights<IRAWPopulationGroup>(indicatorArgs);
            const data: DH.IPopulationDistribution[] = raw.reduce((acc: DH.IPopulationDistribution[], row) => {
                const rural = {group: 'rural', value: Number(row.value_rural), year: Number(row.year) };
                const urban = {group: 'urban', value: Number(row.value_urban),  year: Number(row.year) };
                return [...acc, rural, urban];
            }, []);
            const toolTip = await getIndicatorToolTip(indicatorArgs);
            return {toolTip, data};
       } catch (error) {
           throw error;
       }
    }
}

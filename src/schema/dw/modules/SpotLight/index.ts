import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {formatNumbers} from '../../../../utils';
import sql from './sql';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as R from 'ramda';
import {isError} from '../../../../lib/isType';
import {getIndicatorData, RECIPIENT, DONOR, IGetIndicatorArgs, isDonor, IProcessedSimple,
        IRAWPopulationAgeBand, normalizeKeyName, IRAW, IRAWQuintile, getTableNameFromSql,
        indicatorDataProcessingSimple, getTotal, IRAWPopulationGroup, } from '../utils';

interface ISpotlightArgs {
    id: string;
    country: string;
}

interface IRegionalResources {
    regionalResources: string;
    regionalResourcesBreakdown: DH.IIndicatorDataColored[];
}

export default class Profile {
    private db: IDatabase<IExtensions> & IExtensions;
    private defaultArgs;

    constructor(db: any) {
        this.db = db;
        this.defaultArgs = {db: this.db, conceptType: 'spotlight'};
    }
    // id eg uganda or kenya
    public async getOverViewTabRegional(opts: ISpotlightArgs): Promise<DH.IOverViewTabRegional> {
        const regionalResources = await this.getRegionalResources(opts);
        const [poorestPeople, localGovernmentSpendPerPerson] = await
            this.getIndicatorsGeneric(opts, [sql.poorestPeople, sql.localGovernmentSpendPerPerson]);
        return {
            ...regionalResources,
            poorestPeople,
            localGovernmentSpendPerPerson
        };
    }
    public async getPopulationTabRegional(opts: ISpotlightArgs): Promise<DH.IPopulationTabRegional> {
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
    }
    public async getPovertyTabRegional(opts: ISpotlightArgs): Promise<DH.IPovertyTabRegional> {
        const [poorestPeople, lifeExpectancy, stdOfLiving] =
            await this.getIndicatorsGeneric(opts, [sql.poorestPeople, sql.lifeExpectancy, sql.stdOfLiving]);
        return {
            poorestPeople,
            lifeExpectancy,
            stdOfLiving
        };
    }
    public async getEducationTabRegional(opts: ISpotlightArgs): Promise<DH.IEducationTabRegional> {
        const [pupilTeacherRatioGovtSchl, pupilTeacherRatioOtherSchl, studentsPass, primaryEducationfunding] =
            await this.getIndicatorsGeneric(opts,
                [sql.pupilTeacherRatioGovtSchl, sql.pupilTeacherRatioOtherSchl,
                sql.studentsPass, sql.primaryEducationfunding]);
        return {
            pupilTeacherRatioGovtSchl,
            pupilTeacherRatioOtherSchl,
            studentsPass,
            primaryEducationfunding
        };
    }
    public async getHealthTabRegional(opts): Promise<DH.IHealthTabRegional> {
        const [districtPerformance, treatmeantOfTb, healthCareFunding] =
            await this.getIndicatorsGeneric(opts,
                [sql.districtHealthPerformance, sql.treatmeantOfTb, sql.healthCareFunding]);
        return {
            districtPerformance,
            treatmeantOfTb,
            healthCareFunding
        };
    }

    public async getLocalGovernmentFinance(id): Promise<DH.ILocalGovernmentFinance> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.localGovernmentFinance,
            id
        };
        const data: IRAW[] = await getIndicatorData<IRAW>(indicatorArgs);

    }
    private async getRegionalResources(opts): Promise<IRegionalResources> {
        const indicatorArgs = [sql.lGFResources, sql.crResources, sql.dResources]
            .map(query => ({query, ...this.defaultArgs, ...opts}));
        const resourcesRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
        const resourcesSum = resourcesRaw.reduce((sum, data) => Number(data[0].value) + sum, 0);
        const resourceWithConceptPromises: Array<Promise<DH.IIndicatorDataColored>> = indicatorArgs
            .map(async (query, index) => {
                const conceptId = getTableNameFromSql(query);
                if (isError(conceptId)) throw conceptId;
                const concept = await getConceptAsync(`spotlight-${opts.country}`, conceptId);
                const resource: IRAW = resourcesRaw[index][0];
                return {...concept, value: Number(resource.value), year: concept.startYear};
            });
        const resources: DH.IIndicatorDataColored[] = await Promise.all(resourceWithConceptPromises);
        return {
            regionalResources: formatNumbers(resourcesSum, 1),
            regionalResourcesBreakdown: resources
        };
    }
    private async getIndicatorsGeneric(opts: ISpotlightArgs, sqlList: string[])
        : Promise<string[]>  {
        const indicatorArgs: IGetIndicatorArgs[] =
            sqlList.map(query => ({...this.defaultArgs, query, ...opts}));
        const indicatorRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
       //  if (!format) return indicatorRaw.map(data => indicatorDataProcessingSimple<IProcessedSimple>(data));
        return indicatorRaw.map(data => formatNumbers(data[0].value, 1));
    }
    private async getPopulationDistribution(opts): Promise<DH.IPopulationDistribution[]> {
        const indicatorArgs: IGetIndicatorArgs = {
            ...this.defaultArgs,
            query: sql.populationDistribution,
            ...opts
        };
        const data: IRAWPopulationGroup[] = await getIndicatorData<IRAWPopulationGroup>(indicatorArgs);
        return data.reduce((acc: DH.IPopulationDistribution[], row) => {
            const rural = {group: 'rural', value: Number(row.value_rural), year: Number(row.year) };
            const urban = {group: 'urban', value: Number(row.value_urban),  year: Number(row.year) };
            return [...acc, rural, urban];
        }, []);
    }
}

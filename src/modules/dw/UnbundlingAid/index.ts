
import {IDB} from '@devinit/graphql-next/lib/db';
import {makeSqlAggregateQuery, entitesFnMap, DONOR, RECIPIENT, MULTILATERAL, CROSSOVER} from '../../utils';
import {getConceptAsync, IConcept, getConcepts} from '../../refs/concept';
import * as shortid from 'shortid';
import sql from './sql';
import {IEntity, getEntities, getRegional, IRegional, getEntityByIdGeneric,
        getSectors, getBundles, getChannels, getColors, IColor, IEntityBasic} from '../../refs/global';
import * as R from 'ramda';
import {approximate, capitalize} from '@devinit/prelude';

interface IUnbundlingAidQuery {
    from_di_id?: string;
    to_di_id?: string;
    year?: number;
    sector?: string;
    bundle?: string;
    channel?: string;
}
interface IUnbundlingAidOptionsData {
    sector: string[];
    bundle: string[];
    channel: string[];
}
interface IUnBundlingAidCountries {
    to: DH.IIdNamePair[];
    from: DH.IIdNamePair[];
}

interface IUnbundlingEnitity {
    id: string;
    color?: string;
    name: string;
    type?: string;
    region?: string;
}

interface IUnbundlingAidResult extends IUnbundlingAidQuery {
    value: string;
}

export default class UnbundlingAid {
    public static getSqlQueryArgs = (args: DH.IUnbundlingAidQuery): IUnbundlingAidQuery =>
        R.omit(['groupBy', 'aidType'], args) as IUnbundlingAidQuery

    private db: IDB;
    private donorsBlackList = ['country-unspecified', 'region-unspecified', 'organisation-unspecified',
                    'arab-fund', 'afesd', 'idb-sp-fund'];
    constructor(db: any) {
        this.db = db;
    }
    public async getUnbundlingAidData(args: DH.IUnbundlingAidQuery): Promise<DH.IAidUnit[]> {
        try {
            const queryArgs: IUnbundlingAidQuery = UnbundlingAid.getSqlQueryArgs(args);
            const concept = await this.getUnbundlingAidConceptData(args.aidType);
            const table = concept.id;
            const queryStr: string = makeSqlAggregateQuery(queryArgs, args.groupBy, table);
            const raw: IUnbundlingAidResult[] = await this.db.manyCacheable(queryStr);
            const entites: IUnbundlingEnitity[] = await entitesFnMap[args.groupBy]();
            const regions: IRegional[] = await getRegional();
            const colors = await getColors();
            return raw.map((obj) => {
                const entity: IUnbundlingEnitity | undefined = entites.find(item => obj[args.groupBy] === item.id );
                if (!entity) {
                    throw new Error(`error getting unbundling aid entity
                        ${entity} \n for object ${JSON.stringify(obj)}`);
                }
                let color = entity.color || 'grey';
                if (entity.type && entity.region) {
                    const region: IRegional | undefined = getEntityByIdGeneric<IRegional>(entity.region, regions);
                    if (region && region.color) color = region ? region.color : color;
                }
                const colorObj: IColor = getEntityByIdGeneric<IColor>(color, colors);
                return {id: entity.id, value: Number(obj.value), name: entity.name, uid: shortid.generate(),
                        color: colorObj.value, year: Number(obj.year)};
           });
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getUnbundlingSelectionData({aidType}): Promise<DH.IUnbundlingAidSelections> {
        try {
            const concept = await this.getUnbundlingAidConceptData(aidType);
            if (!concept) throw new Error('error getting unbundling aid concept');
            const years: number[] = R.range(Number(concept.start_year), Number(concept.end_year + 1)).reverse();
            const optionIds: IUnbundlingAidOptionsData = await this.getUnbundlingOptionsIds(aidType);
            const countries = await this.getCountries();
            const gChannels = await getChannels();
            const channels = this.getOptionsSet('channel', gChannels, optionIds);
            const gSectors = await getSectors();
            const sectors = this.getOptionsSet('sector', gSectors, optionIds);
            const gBundles = await getBundles();
            const bundles = this.getOptionsSet('bundle', gBundles, optionIds);
            return {years, ...countries, channels, sectors, bundles};
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getUnbundlingAidDataTotal(args: DH.IUnbundlingAidToTalQuery): Promise<DH.IUnbundlingAidTotal> {
        const concept = await this.getUnbundlingAidConceptData(args.aidType);
        const id: string = concept.id;
        try {
            const year: number = args.year || (await getConceptAsync(`unbundling-${args.aidType}`, id)).end_year;
            const  queryArgs = {table: id, year};
            const raw: Array<{sum: string}> = await this.db.manyCacheable(sql.total, queryArgs);
            const total = approximate(raw[0].sum, 1);
            return {total, year};
        } catch (error) {
            throw error;
        }
    }
    public async getUnbundlingOptionsIds(aidType): Promise<IUnbundlingAidOptionsData> {
        const {id} = await this.getUnbundlingAidConceptData(aidType);
        const columns = ['bundle', 'channel', 'sector'];
        type IRawOptions = Array<{[column: string]: string}>;
        const optionsPromises: Array<Promise<IRawOptions>> = columns.map(async (column) => {
            const queryArgs = {table: id, column};
            const raw: IRawOptions =
                await this.db.manyCacheable(sql.options, queryArgs);
            return raw;
        }, {});
        const options: IRawOptions[]  = await Promise.all(optionsPromises);
        return options.reduce((acc, optionsObj) => {
            const key = Object.keys(optionsObj[0])[0] as string;
            const columnFields = optionsObj.map(obj => obj[key]);
            return {...acc, [key]: columnFields };
        }, {}) as IUnbundlingAidOptionsData;
    }
    private getOptionsSet(optionName, cmsOptions, dBOptionsData): IEntityBasic[] {
        const options = dBOptionsData[optionName];
        return options.map(id => {
            const option = cmsOptions.find(obj => obj.id === id);
            const name = capitalize(id.replace(/\-/g, ' '));
            if (!option) return {id, name, color: 'grey'};
            return option;
        });
    }
    private async getUnbundlingAidConceptData(aidType): Promise<IConcept> {
        const allConcepts = await getConcepts(`unbundling-${aidType}`);
        const concept = allConcepts[0];
        if (!concept) throw new Error(`${aidType} concept file missing`);
        return concept;
    }
    private async getCountries(): Promise<IUnBundlingAidCountries> {
        try {
            const entites: IEntity[] = await getEntities();
            return entites.reduce((countries: IUnBundlingAidCountries, entity) => {
            let to: any = [];
            let from: any = [];
            if (entity.donor_recipient_type === RECIPIENT || entity.donor_recipient_type === CROSSOVER
                || entity.donor_recipient_type === 'region') {
                to = R.append({id: entity.id, name: entity.name}, countries.to);
            }
            if (entity.donor_recipient_type === DONOR || entity.donor_recipient_type === MULTILATERAL
                || entity.donor_recipient_type === CROSSOVER) {
                from = R.contains(entity.id, this.donorsBlackList) ? countries.from :
                    R.append({id: entity.id, name: entity.name}, countries.from);
            }
            if (to.length && from.length) return {to, from};
            if (to.length)  return {...countries, to};
            if (from.length)  return {...countries, from};
            return countries;
            }, {to: [], from: []});
        } catch (error) {
            throw error;
        }
    }

}

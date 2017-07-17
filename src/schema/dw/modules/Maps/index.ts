import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {IRAW, getIndicatorDataSimple, indicatorDataProcessingSimple, IProcessedSimple} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {getColors, getEntityByIdGeneric, IColor, IEntity, getEntities} from '../../../cms/modules/global';
import {get} from '../../../cms/connector';
import {getDataRevolutionColors, IRevolutionColorMap} from '../../../cms/modules/globalPicture';
import sql, {DAC, dataRevolution} from './sql';
import * as Color from 'color';
import {scaleThreshold, interpolateRgb} from 'd3';
import * as R from 'ramda';

interface IgetMapDataOpts {
    id: string;
    DACOnly: boolean;
}
interface IColorMap {
    high: string;
    mid: string;
    low: string;
}
interface IRAWDataRevolution {
    detail: string; // this is year
    colour: string;
    di_id: string;
}
interface IDataRevolution {
    detail: number; // this is year
    colour: string;
    id: string;
    uid: string;
}
interface ICategoricalMapping {
    id: string;
    name: string;
}
type Threshold<Range, Output> = (value: Range) => Output;

export default class Maps {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(name =>
            R.find((obj: DH.IMapUnit) => obj.name === name, indicatorData));
    }
    public static colorScale(rangeStr: string, ramp: IColorMap): Threshold<number, string> {
        // PS: TODO: i am not that happy with the way i am handling inverse ranges ie 50,10,0 it doesnt seem right
        const domain = rangeStr.split (',').map(val => Number(val));
        const isAscendingOrder = (domain[1] > domain[0]) ? true : false;
        const range = R.range(0, domain.length + 1).map((index) => {
            if (index === 0) return ramp.low;
            if (index === domain.length) return ramp.high;
            if (index === Math.floor(domain.length / 2)) return ramp.mid;
            return index < domain.length / 2 ? interpolateRgb(ramp.low, ramp.mid)(index / domain.length)
                :   interpolateRgb(ramp.mid, ramp.high)(index / domain.length);
        });
        return scaleThreshold()
            .domain(isAscendingOrder ? domain : R.reverse(domain))
            .range(range);
    }
    public static async getColorRamp(color: string): Promise<IColorMap> {
        const colors = await getColors();
        return ['darker', 'mid', 'lighter'].reduce((colorMap: IColorMap, variation) => {
            const colorStr = variation === 'mid' ? color : `${color}-${variation}`;
            const colorObj = getEntityByIdGeneric<IColor>(colorStr, colors);
            const colorValue = colorObj.value;
            if (variation === 'darker') return {...colorMap, high: colorValue};
            if (variation === 'lighter') return {...colorMap, low: colorValue};
            return  {...colorMap, mid: colorValue};
        }, {}) as IColorMap;
    }
    public static async getCategoricalMapping(indicatorName: string): Promise<ICategoricalMapping[]> {
        const categoryMapName = indicatorName.includes('fragile_states') ? 'fragile-states.csv'
            : 'data-revolution-colors.csv';
        return await get<ICategoricalMapping>(`global-picture/${categoryMapName}`);
    }
    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IMapData> {
         try {
             const concept: IConcept = await getConceptAsync('global-picture', opts.id);
             // we merge concept and graphql qery options, they have startYear and endYear variables
             const processedData: DH.IMapUnit[] = await this.indicatorDataProcessing(concept);
             const DACCountries = opts.DACOnly ? await this.getDACCountries() : [];
             const mapData = DACCountries.length ? Maps.DACOnlyData(DACCountries, processedData) : processedData;
             return {map: mapData, ...concept} as DH.IMapData;
         } catch (error) {
             console.error(error);
             throw error;
         }
    }
    private async indicatorDataProcessing(concept: IConcept): Promise<DH.IMapUnit[]> {
        if (concept.color) {
            const args = {...concept, sql, db: this.db, table: concept.id};
            const data: IRAW [] = await getIndicatorDataSimple<IRAW>(args);
            return concept.range ? this.linearDataProcessing(concept, data) :
                this.categoricalDataProcessing(concept, data);
        }
        return this.dataRevDataProcessing(concept);
    }
    private async linearDataProcessing(concept: IConcept, data: IRAW[]):
        Promise<DH.IMapUnit[]> {
        if (!concept.color || !concept.range) throw new Error (`color or range missing for ${concept.id}`);
        const ramp = await Maps.getColorRamp(concept.color);
        const scale = Maps.colorScale(concept.range, ramp);
        return this.processScaleData(scale, data);
    }
    private async categoricalDataProcessing(concept: IConcept, data: IRAW[]):
        Promise<DH.IMapUnit[]> {
        if (!concept.color) throw new Error (`color missing for ${concept.id}`);
        const categoricalMappings: ICategoricalMapping[] = await Maps.getCategoricalMapping(concept.id);
        const range = categoricalMappings.map(obj => obj.id).join(',');
        const ramp = await Maps.getColorRamp(concept.color);
        const scale = Maps.colorScale(range, ramp);
        return this.processScaleData(scale, data, categoricalMappings);
    }
    private async processScaleData(scale: Threshold<number, string>, data: IRAW[], cMapping?: ICategoricalMapping[]):
        Promise<DH.IMapUnit[]> {
        const entities: IEntity[] = await getEntities();
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
        return processedData.map(obj => {
            const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);
            let detail: any = null;
            if (cMapping) {
                const categoryMap: ICategoricalMapping | undefined =
                    cMapping.find(mapping => Number(mapping.id) === obj.value);
                if (!categoryMap)
                    throw new Error(`Categorical mapping for ${obj.value} is missing in ${JSON.stringify(cMapping)}`);
                detail = categoryMap.name;
            }
            const colorObj = Color(scale(obj.value));
            return {
                ...obj,
                detail,
                name: entity.name,
                color: colorObj.hex(),
            };
        });
    }
    private async dataRevDataProcessing(concept: IConcept): Promise<DH.IMapUnit[]> {
        if (concept.theme !== 'data-revolution')
            throw new Error(`please cross check the concept details for ${concept.id}`);
        const table = concept.id;
        const args = {...concept, query: dataRevolution, db: this.db, table};
        const data: IRAWDataRevolution [] = await getIndicatorDataSimple<IRAWDataRevolution>(args);
        const processedData: IDataRevolution[] = indicatorDataProcessingSimple<IDataRevolution>(data);
        const dataRevColorMaps = await getDataRevolutionColors();
        const dataRevColorMap: IRevolutionColorMap =
            getEntityByIdGeneric<IRevolutionColorMap>(table, dataRevColorMaps);
        const colors = await getColors();
        const entities: IEntity[] = await getEntities();
        return processedData.map(obj => {
            const colorObj: IColor = getEntityByIdGeneric<IColor>(obj.colour.toLowerCase(), colors);
            const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);
            return {
                ...obj,
                value: null,
                year: obj.detail,
                name: entity.name,
                detail: dataRevColorMap[obj.colour.toLowerCase()],
                color: colorObj.value
            };
        });
    }
    private async getDACCountries(): Promise<string[]> {
        try {
            const donors: Array< {donor_name: string} > = await this.db.manyCacheable(DAC, 'DAC');
            return donors
                .map(donor => donor.donor_name);
        } catch (error) {
            throw error;
        }
    }
}

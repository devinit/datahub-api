import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {IRAW, getIndicatorDataSimple, getTotal, indicatorDataProcessingSimple, IProcessedSimple} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {getColors, getEntityByIdGeneric, IColor, IEntity, getEntities} from '../../../cms/modules/global';
import sql, {DAC} from './sql';
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

type Threshold<Range, Output> = (value: Range) => Output;

export default class Maps {

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(name =>
            R.find((obj: DH.IMapUnit) => obj.name === name, indicatorData));
    }
    public static colorScale(rangeStr: string, ramp: IColorMap): Threshold<number, string> {
        const domain = rangeStr.split (',').map(val => Number(val));
        const range = R.range(0, domain.length + 1).map((index) => {
            if (index === 0) return ramp.low;
            if (index === domain.length) return ramp.high;
            if (index === Math.floor(domain.length / 2)) return ramp.mid;
            return index < domain.length / 2 ? interpolateRgb(ramp.low, ramp.mid)(index / domain.length)
                :   interpolateRgb(ramp.mid, ramp.high)(index / domain.length);
        });
        // console.log('domain', domain);
        // console.log('range', range);
        return scaleThreshold()
            .domain(domain)
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
    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IMapData> {
         try {
             const concept: IConcept = await getConceptAsync('global-picture', opts.id);
             // we merge concept and graphql qery options, they have startYear and endYear variables
             const args = {...concept, sql, db: this.db, table: opts.id};
             const data: IRAW [] = await getIndicatorDataSimple<IRAW>(args);
             const DACCountries = opts.DACOnly ? await this.getDACCountries() : [];
             const processedData: DH.IMapUnit[] = await this.indicatorDataProcessing(concept, data);
             const mapData = DACCountries.length ? Maps.DACOnlyData(DACCountries, processedData) : processedData;
             const total: number = getTotal(mapData);
             return {map: mapData, total, ...concept} as DH.IMapData;
         } catch (error) {
             console.error(error);
             throw error;
         }
    }
    private async indicatorDataProcessing(concept: IConcept, data: IRAW[]): Promise<DH.IMapUnit[]> {
        if (!concept.color) throw new Error(`${concept.id} is missing color entry`);
        const ramp = await Maps.getColorRamp(concept.color);
        if (!concept.range) throw new Error(`${concept.id} is missing legend range entry`);
        const entities: IEntity[] = await getEntities();
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
        const scale = Maps.colorScale(concept.range, ramp);
        return processedData.map(obj => {
            const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);
            const colorObj = Color(scale(obj.value));
            return {
                ...obj,
                name: entity.name,
                color: colorObj.hex(),
            };
        });
    }
    private async getDACCountries(): Promise<string[]> {
        try {
            const donors: Array<{donor_name: string}> = await this.db.manyCacheable(DAC, 'DAC');
            return donors
            .map(donor => donor.donor_name);
        } catch (error) {
            throw error;
        }
    }
}

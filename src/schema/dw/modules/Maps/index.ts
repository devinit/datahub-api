import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {getIndicatorDataSimple, indicatorDataProcessingSimple, IGetIndicatorArgsSimple,
    IProcessedSimple, normalizeKeyName, formatNumbers} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {getColors, getEntityByIdGeneric, IColor, IEntity, getEntities, IEntityBasic} from '../../../cms/modules/global';
import {get} from '../../../cms/connector';
import {getDataRevolutionColors, IRevolutionColorMap} from '../../../cms/modules/globalPicture';
import {getDistrictEntities} from '../../../cms/modules/spotlight';
import sql, {DAC, dataRevolution} from './sql';
import * as Color from 'color';
import {scaleThreshold, interpolateRgb, hsl} from 'd3';
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
    color?: string;
}
interface IRAWMapData {
    id?: string;
    district_id?: string;
    value: string;
    year: string;
}
interface IMapDataWithLegend {
    mapData: DH.IMapUnit[];
    legend: DH.ILegendField[];
}
interface IScaleThreshold <Input, Output> {
    (value: Input): Output;
    range(): Output[];
    domain(): Input[];
}
const lightGrey = '#d0cccf';

export default class Maps {
    public static noDataLegendEntry: DH.ILegendField = {
        color: 'white', backgroundColor: lightGrey, label: 'no data/not applicable'};

    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(name =>
            R.find((obj: DH.IMapUnit) => obj.name === name, indicatorData));
    }

    public static colorScale(rangeStr: string, ramp: IColorMap, offset: number = 1): IScaleThreshold<number, string> {
        const domain = rangeStr.split (',').map(val => Number(val));
        const isAscendingOrder = (domain[1] > domain[0]) ? true : false;
        const range = R.range(0, domain.length + offset).map((index) => {
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
    public static createLinearLegend(
        uom_display: string,
        rangeStr: string, scale: IScaleThreshold<number, string>): DH.ILegendField[] {
        const formatVal: (number) => string = (val) => uom === '%'  ? val : formatNumbers(val);
        const uom = uom_display === '%' ? uom_display : '';
        const inputRange = rangeStr.split(',').map(val => Number(val));
        const domain = scale.domain();
        const range = scale.range();
        const legend = domain.reduce((acc: DH.ILegendField[], val: number, index: number) => {
            const backgroundColor = range[index];
            const hslColor = hsl(backgroundColor);
            const color =  (hslColor.l > 0.7) ? 'black' : 'white';
            const currentVal  = formatVal(val);
            if (index === 0 ) {
                return [{backgroundColor, color,  label: `<${currentVal}${uom}`}];
            }
            const prevVal = formatVal(domain[index - 1]);
            if (index < (domain.length - 1)) {
                const label = `${prevVal}-${currentVal}`;
                return [...acc, {backgroundColor, color, label}];
            }
            // the range will always be longer by the domain by 1, (which is the offset variable in the scale function)
            // but for some scales like the fragile states scale the range and domain will be the same.
            // and hence they be no need of an extra legend field (hope this makes sense)
            const lastBackgroundColor = range[index + (range.length - domain.length)];
            const lastEntry = range.length > domain.length ?
                [{color, backgroundColor, label: `${prevVal}-${currentVal}`},
                {color, backgroundColor: lastBackgroundColor, label: `>${currentVal}`}]
                :
                [{color, backgroundColor: lastBackgroundColor, label: `>${currentVal}`}];
            return [...acc, ...lastEntry, Maps.noDataLegendEntry];
        }, []);
        if (inputRange[0] < inputRange[1]) return legend;
        return [...(R.reverse(R.init(legend))), R.last(legend)] as DH.ILegendField[];
    }
    public static categoricalLegendFromLinear(cMappings: ICategoricalMapping[], linearLegend: DH.ILegendField[]):
        DH.ILegendField[] {
        return linearLegend.map(legendField => {
            if (!legendField.label) throw new Error('legend field is missing a label');
            if (legendField.label.includes('no data')) return legendField;
            const hasDash = legendField.label.includes('-');
            const label = !hasDash ? R.match(/\d+/g, legendField.label)[0]
                : legendField.label.split('-')[1];
            const obj = cMappings.find(mapping => Number(mapping.id) === Number(label));
            if (!obj) throw new Error(`failed to find obj in category mapping for ${JSON.stringify(legendField)}`);
            return {...legendField, label: obj.name};
        });
    }
    public static async getCategoricalMapping(indicator: string, theme?: string): Promise<ICategoricalMapping[]> {
        const categoryMapName = theme === 'data-revolution' ?  'data-revolution-colors' :
            normalizeKeyName(indicator.split('.')[1]);
        return await get<ICategoricalMapping>(`global-picture/${categoryMapName}.csv`);
    }
    public static getValueDetail(value: number, categoryMappings: ICategoricalMapping[]): ICategoricalMapping {
        const categoryMapping: ICategoricalMapping | undefined =
                    categoryMappings.find(mapping => Number(mapping.id) === value);
        if (!categoryMapping)
            throw new Error(`Categorical mapping for ${value} is missing in ${JSON.stringify(categoryMapping)}`);
        return categoryMapping;
    }
    public static async getCountry(indicator: string): Promise<string> {
        const tableName = indicator.split('.')[1];
        if (!tableName) throw new Error(`invalid indicator name, every indicator should be in a schema: ${indicator}`);
        const country = tableName.split('_')[0];
        // check if first value is a country
        const entities: IEntity[] = await getEntities();
        const entity = entities.find(obj => obj.slug === country);
        if (entity && entity.type === 'country') return entity.slug;
        return 'global';
    }
    private db: IDatabase<IExtensions> & IExtensions;

    constructor(db: any) {
        this.db = db;
    }

    public async getMapData(opts: IgetMapDataOpts): Promise<DH.IMapData> {
         try {
             const country = await Maps.getCountry(opts.id);
             const concept: IConcept = country === 'global' ?
                 await getConceptAsync('global-picture', opts.id)
                 : await getConceptAsync(`spotlight-${country}`, opts.id);
             // we merge concept and graphql qery options, they have startYear and endYear variables
             const {mapData, legend} = await this.getMapIndicatorData(concept, country);
             const DACCountries = concept.dac_only ? await this.getDACCountries() : [];
             const map = DACCountries.length ? Maps.DACOnlyData(DACCountries, mapData) : mapData;
             const end_year = concept.end_year ? concept.end_year : concept.start_year;
             const default_year = concept.default_year ? concept.default_year : end_year;
             return {map, legend, ...concept, country, end_year, default_year } as DH.IMapData;
         } catch (error) {
             console.error(error);
             throw error;
         }
    }
    private async getMapIndicatorData(concept: IConcept, country: string): Promise<IMapDataWithLegend> {
        if (concept.theme === 'data-revolution') {
           return this.dataRevDataProcessing(concept);
        }
        const args = {...concept, sql, db: this.db, table: concept.id} as IGetIndicatorArgsSimple;
        const data: IRAWMapData [] = await getIndicatorDataSimple<IRAWMapData>(args);
        if (concept.range && concept.color)
            return this.linearDataProcessing(concept, country, data);
        if (concept.color)  return this.categoricalLinearDataProcessing(concept, country, data);
        return this.categoricalDataProcessing(concept, country, data);
    }
    private async linearDataProcessing(concept: IConcept, country: string, data: IRAWMapData[]):
        Promise<IMapDataWithLegend> {
        if (!concept.range || !concept.color) throw new Error(`color and range values missing for ${concept.id}`);
        const ramp = await Maps.getColorRamp(concept.color);
        const scale = Maps.colorScale(concept.range, ramp);
        const legend = Maps.createLinearLegend(concept.uom_display, concept.range, scale);
        const mapData = await this.processScaleData(scale, data, country);
        return {legend, mapData};
    }
    private async categoricalLinearDataProcessing(concept: IConcept, country: string, data: IRAWMapData[]):
        Promise<IMapDataWithLegend> {
        if (!concept.color) throw new Error (`color missing for ${concept.id}`);
        const categoricalMappings: ICategoricalMapping[] = await Maps.getCategoricalMapping(concept.id, concept.theme);
        const range = categoricalMappings.map(obj => obj.id).join(',');
        const ramp = await Maps.getColorRamp(concept.color);
        const scale = Maps.colorScale(range, ramp, 0);
        const linearLegend = Maps.createLinearLegend(concept.uom_display, range, scale);
        const legend = Maps.categoricalLegendFromLinear(categoricalMappings, linearLegend);
        const mapData = await this.processScaleData(scale, data, country, categoricalMappings);
        return {legend, mapData};
    }
    private async processScaleData(
        scale: IScaleThreshold<number, string>,
        data: IRAWMapData[], country: string, cMappings?: ICategoricalMapping[]):
        Promise< DH.IMapUnit[]> {
        const entities: IEntityBasic[] = country === 'global' ?
            await getEntities() :  await getDistrictEntities(country);
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data, country);
        return processedData.map((obj) => {
            const entity = getEntityByIdGeneric<IEntityBasic>(obj.id, entities);
            let detail: any = null;
            if (cMappings) {
                detail = Maps.getValueDetail(obj.value, cMappings).name;
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
    private async categoricalDataProcessing(concept: IConcept, country: string, data: IRAWMapData[]):
        Promise<IMapDataWithLegend> {
        const cMappings: ICategoricalMapping[] = await Maps.getCategoricalMapping(concept.id, concept.theme);
        const colors = await getColors();
        const entities: IEntityBasic[] = country === 'global' ?
            await getEntities() : await getDistrictEntities(country) ;
        const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data, country);
        const mapData = processedData.map(obj => {
           const cMapping = Maps.getValueDetail(obj.value, cMappings);
           const entity = getEntityByIdGeneric<IEntityBasic>(obj.id, entities);
           if (!cMapping.color) throw new Error(`color value is missing for ${JSON.stringify(cMapping)}`);
           const colorObj = getEntityByIdGeneric<IColor>(cMapping.color, colors);
           return {...obj, color: colorObj.value, name: entity.name, detail: cMapping.name};
        });
        const legend: DH.ILegendField[] = cMappings.map(cMapping => {
            if (!cMapping.color) throw new Error(`color value is missing for ${JSON.stringify(cMapping)}`);
            const colorObj = getEntityByIdGeneric<IColor>(cMapping.color, colors);
            const hslColor = hsl(colorObj.value);
            const textColor =  (hslColor.l > 0.7) ? 'black' : 'white';
            return {color: textColor, backgroundColor: colorObj.value, label: cMapping.name};
        });
        return {mapData, legend: R.append(Maps.noDataLegendEntry, legend)};
    }
    private async dataRevDataProcessing(concept: IConcept): Promise<IMapDataWithLegend> {
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
        const mapData = processedData.map(obj => {
            const colorObj: IColor = getEntityByIdGeneric<IColor>(obj.colour.toLowerCase(), colors);
            const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);
            return {
                ...obj,
                value: null,
                year: Number(obj.detail) ? obj.detail : 0,
                name: entity.name,
                detail: dataRevColorMap[obj.colour.toLowerCase()],
                color: colorObj.value
            };
        });
        const legend = R.keys(dataRevColorMap).reduce((acc: DH.ILegendField[], key) => {
            if (key === 'id') return acc;
            const colorObj: IColor = getEntityByIdGeneric<IColor>(key, colors);
            const hslColor = hsl(colorObj.value);
            const textColor =  (hslColor.l > 0.7) ? 'black' : 'white';
            return [...acc,
                {backgroundColor: colorObj.value, color: textColor, label:  dataRevColorMap[key]},
                ];
        }, []);
        return {mapData, legend: R.append(Maps.noDataLegendEntry, legend)};
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

import { IConcept, getConceptAsync } from '../../refs/concept';
import { IDB } from '../../../api/db';
import { approximate, normalizeKeyName } from '@devinit/prelude';
import * as Color from 'color';
import { hsl } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import { scaleThreshold } from 'd3-scale';
import * as R from 'ramda';
import { githubGet } from '../../../api/github';
import { IColor, IEntity, getColors, getEntities, getEntityByIdGeneric } from '../../refs/global';
import { IRevolutionColorMap, getDataRevolutionColors } from '../../refs/globalPicture';
import { IDistrict, getDistrictEntities } from '../../refs/spotlight';
import { getIndicatorDataSimple, indicatorDataProcessingSimple } from '../../utils';
import { IGetIndicatorArgsSimple, IProcessedSimple } from '../../utils/types';
import sql, { DAC, dataRevolution } from './sql';
import {
  ICategoricalMapping,
  IColorMap,
  IColorScaleArgs,
  IDataRevolution,
  ILinearLegendArgs,
  IMapDataWithLegend,
  IProcessScaleData,
  IRAWDataRevolution,
  IRAWMapData,
  IScaleThreshold
} from './types';

const lightGrey = '#d0cccf';

export default class Maps {
  public static noDataLegendEntry: DH.ILegendField = {
    color: 'white', backgroundColor: lightGrey, label: 'no data/not applicable'
  };

  private db: IDB;

  private async getDACCountries(): Promise<string[]> {
    try {
      const donors: Array<{ donor_name: string }> = await this.db.manyCacheable(DAC, 'DAC');

      return donors
        .map(donor => donor.donor_name);
    } catch (error) {
      throw error;
    }
  }

  public static DACOnlyData = (DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] =>
    indicatorData.filter(obj => DACCountries.includes(obj.name))

  public static processBudgetData(data: DH.IMapUnit[]): DH.IMapUnit[] {
    const grouped = R.groupBy<DH.IMapUnit>(obj => obj.year.toString(), data);

    return R.keys(grouped).reduce((acc: DH.IMapUnit[], year) => {
      const yearData = grouped[year];
      const groupedById = R.groupBy<DH.IMapUnit>(R.prop('id'), yearData);
      const filterdData = R.keys(groupedById).map(id => {
        const countryDataArr = groupedById[id] as DH.IMapUnit[];
        if (countryDataArr.length) {
          const list = countryDataArr.filter(obj => obj.detail === 'actual');
          if (list[0]) { return list[0]; }

          return countryDataArr[0];
        }

        return countryDataArr[0];
      }) as DH.IMapUnit[];

      return acc.concat(filterdData);
    }, []);
  }

  public static colorScale(args: IColorScaleArgs): IScaleThreshold<number, string> {
    const { rangeStr, ramp } = args;
    const offset = 1;
    const domain = rangeStr.split(',').map(val => Number(val));
    const isHighBetter = args.isHighBetter || false;
    const effectiveDomain = domain.length + offset;
    const range = R.range(0, effectiveDomain).map((index) => {
      return interpolateRgb(ramp.low, ramp.high)(index / (domain.length));
    });

    return scaleThreshold()
      .domain(domain[0] > domain[1] ? domain.reverse() : domain)
      .range(isHighBetter ? range.reverse() : range);
  }

  public static async getColorRamp(color: string): Promise<IColorMap> {
    const colors = await getColors();
    const baseRamp = [ 'high', 'low' ].reduce((colorMap: IColorMap, variation) => {
      const colorStr = variation === 'high' ? color : `${color}-lighter`;
      const colorObj = getEntityByIdGeneric<IColor>(colorStr, colors);
      const colorValue = colorObj.value;

      return { ...colorMap, [variation]: colorValue };
    }, {} as IColorMap) as IColorMap;

    return baseRamp;
  }

  public static createLinearLegend(opts: ILinearLegendArgs): DH.ILegendField[] {
    const { uom_display, rangeStr, scale, precision = 1 } = opts;
    const uom = uom_display ? uom_display : '';
    const inputDomain = rangeStr.split(',').map(val => Number(val));
    const isAscendingOrder = inputDomain[0] < inputDomain[1];
    const firstSign = '<';
    const secondSign = '>';
    const domain = scale.domain(); // numbers
    const range = scale.range();
    const legend = domain.reduce((acc: DH.ILegendField[], val: number, index: number) => {
      const backgroundColor = range[index];
      const hslColor = hsl(backgroundColor);
      const color = (hslColor.l > 0.7) ? 'black' : 'white';
      const currentVal = approximate(val, precision, true);
      if (index === 0) {
        return [ { backgroundColor, color, label: `${firstSign}${currentVal} ${uom}` } ];
      }
      const prevVal = approximate(domain[index - 1], precision, true);
      if (index < (domain.length - 1)) {
        const label = `${prevVal}-${currentVal}`;

        return [ ...acc, { backgroundColor, color, label } ];
      }
      // the range will always be longer by the domain by 1, (which is the offset variable in the scale function
      // but for some scales like the fragile states scale the range and domain will be the same.
      // and hence they be no need of an extra legend field (hope this makes sense)
      const lastBackgroundColor = range[index + (range.length - domain.length)];
      const lastEntry = range.length > domain.length ?
        [ { color, backgroundColor, label: `${prevVal}-${currentVal}` },
        { color, backgroundColor: lastBackgroundColor, label: `${secondSign}${currentVal} ${uom}` } ]
        :
        [ { color, backgroundColor: lastBackgroundColor, label: `${secondSign}${currentVal} ${uom}` } ];

      return [ ...acc, ...lastEntry, Maps.noDataLegendEntry ];
    }, []);

    return isAscendingOrder ? legend : [ ...R.dropLast(1, legend).reverse(), R.last(legend) ] as DH.ILegendField[];
  }

  public static async getCategoricalMapping(indicator: string, theme?: string): Promise<ICategoricalMapping[]> {
    const categoryMapName = theme === 'data-revolution'
      ? 'data-revolution-colors'
      : normalizeKeyName(indicator.split('.')[1]);

    return githubGet<ICategoricalMapping>(`global-picture/${categoryMapName}.csv`);
  }

  public static getValueDetail(value: number, categoryMappings: ICategoricalMapping[]): ICategoricalMapping {
    const categoryMapping: ICategoricalMapping | undefined = categoryMappings.find(mapping =>
      Number(mapping.id) === value);
    if (!categoryMapping) {
      throw new Error(`Categorical mapping for ${value} is missing in ${JSON.stringify(categoryMapping)}`);
    }

    return categoryMapping;
  }

  // for categorising whether spotligh on uganda or global picture
  public static async getCountry(indicator: string): Promise<string> {
    const tableName = indicator.split('.')[1];
    if (!tableName) { return 'global'; } // eg survey_p20
    const country = tableName.split('_')[0];
    // check if first value is a country
    const entities: IEntity[] = await getEntities();
    const entity = entities.find(obj => obj.slug === country);
    if (entity && entity.type === 'country') { return entity.slug; }

    return 'global';
  }

  // for dealing with edge cases and wrong data
  public static transformations(concept: IConcept, data: IRAWMapData[]): IRAWMapData[] {
    return data.map(obj => {
      if (concept.id === 'data_series.in_ha') {
        return { ...obj, value: obj.value && Number(obj.value) * 1e6 };
      }
      if (concept.id === 'spotlight_on_uganda.uganda_urban_pop') {
        return { ...obj, value: obj.value && Number(obj.value).toFixed(0) };
      }
      if (concept.uom_display === '%') {
        return { ...obj, value: obj.value && Number(obj.value).toFixed(2) };
      }
      if (concept.uom_display === 'US$') {
        return { ...obj, value: obj.value && Number(obj.value).toFixed(2) };
      }

      return obj;
    });
  }

  constructor(db: any) {
    this.db = db;
  }

  async getMapData(id: string): Promise<DH.IMapData> {
    try {
      const country = await Maps.getCountry(id);
      const concept: IConcept = country === 'global'
        ? await getConceptAsync('global-picture', id)
        : await getConceptAsync(`spotlight-${country}`, id);

      const end_year = concept.end_year ? concept.end_year : concept.start_year;
      const default_year = concept.default_year ? concept.default_year : end_year;
      if (concept.map_style) {
        const styledMapLegend = await this.getStyledMapData(concept);

        return {
          ...concept,
          map: [],
          legend: styledMapLegend,
          country,
          end_year,
          default_year
        } as DH.IMapData;
      }
      // we merge concept and graphql query options, they have startYear and endYear variables
      const { mapData, legend } = await this.getMapIndicatorData(concept, country);
      const DACCountries = concept.dac_only ? await this.getDACCountries() : [];
      const data = DACCountries.length ? Maps.DACOnlyData(DACCountries, mapData) : mapData;

      return { map: data, legend, ...concept, country, end_year, default_year } as DH.IMapData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStyledMapData(concept: IConcept): Promise<DH.ILegendField[]> {
    if (!concept.range || !concept.color) {
      throw new Error('indicator with mapbox map style msissing color & range');
    }
    const ramp = await Maps.getColorRamp(concept.color);
    const scale = Maps.colorScale({ rangeStr: concept.range, ramp });

    return Maps.createLinearLegend({
      uom_display: concept.uom_display,
      rangeStr: concept.range,
      scale
    });
  }

  private async getMapIndicatorData(concept: IConcept, country: string): Promise<IMapDataWithLegend> {
    if (concept.theme === 'data-revolution') {
      return this.dataRevDataProcessing(concept);
    }
    const args = { ...concept, sql, db: this.db, table: concept.id } as IGetIndicatorArgsSimple;
    const raw: IRAWMapData[] = await getIndicatorDataSimple<IRAWMapData>(args);
    const data = Maps.transformations(concept, raw); // for edge cases
    // eliminate non country data
    if (concept.range && concept.color) {
      return this.linearDataProcessing(concept, country, data);
    }

    return this.categoricalDataProcessing(concept, country, data);
  }

  private async linearDataProcessing(concept: IConcept, country: string, data: IRAWMapData[]):
    Promise<IMapDataWithLegend> {
    if (!concept.range || !concept.color) {
      throw new Error(`color and range values missing for ${concept.id}`);
    }
    const ramp = await Maps.getColorRamp(concept.color);
    const isHighBetter = concept.is_high_better && concept.is_high_better > 0 ? true : false;
    const scale = Maps.colorScale({ rangeStr: concept.range, ramp, isHighBetter });
    const twoDPIndicators = [ 'fact.oda_to_ldcs_percent_gni', 'fact.oda_percent_gni' ];
    const legend = Maps.createLinearLegend({
      uom_display: concept.uom_display,
      rangeStr: concept.range,
      scale,
      precision: twoDPIndicators.includes(concept.id) ? 2 : 1
    });
    const mapData = await this.processLinearScaleData({ scale, data, country });

    return { legend, mapData };
  }

  private async processLinearScaleData(args: IProcessScaleData): Promise<DH.IMapUnit[]> {
    const { scale, data, country } = args;
    const entities: IDistrict[] | IEntity[] = country === 'global' ?
      await getEntities() : await getDistrictEntities(country);
    const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data, country);
    const hasBudgeTypes: boolean = processedData && processedData[0] && processedData[0].budget_type ? true : false;
    const processed: DH.IMapUnit[] = processedData
      .filter((obj) => {
        const entity = getEntityByIdGeneric<IDistrict | IEntity>(obj.id, entities);
        const type = (entity as IEntity).type;
        if (country === 'global') { return type === 'country'; }

        return true;
      })
      .map((obj) => {
        const entity = getEntityByIdGeneric<IDistrict | IEntity>(obj.id, entities);
        let detail: any = null;
        // if (cMappings) detail = Maps.getValueDetail(obj.value, cMappings).name;
        if (hasBudgeTypes) { detail = obj.budget_type; }
        const color = Color(scale(obj.value)).hex();
        const slug = (entity as IEntity).slug ? (entity as IEntity).slug : entity.name.toLowerCase();

        return {
          ...obj,
          detail,
          slug,
          name: entity.name,
          color
        };
      });
    if (hasBudgeTypes) { return Maps.processBudgetData(processed); }

    return processed;
  }

  private async categoricalDataProcessing(concept: IConcept, country: string, data: IRAWMapData[]):
    Promise<IMapDataWithLegend> {
    const cMappings: ICategoricalMapping[] = await Maps.getCategoricalMapping(concept.id, concept.theme);
    const colors = await getColors();
    const entities: IEntity[] | IDistrict[] = country === 'global' ?
      await getEntities() : await getDistrictEntities(country);
    const processedData: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data, country);
    const mapData = processedData.map(obj => {
      const cMapping = Maps.getValueDetail(obj.value, cMappings);
      const entity = getEntityByIdGeneric<IEntity | IDistrict>(obj.id, entities);
      if (!cMapping.color) {
        throw new Error(`color value is missing for ${JSON.stringify(cMapping)}`);
      }
      const colorObj = getEntityByIdGeneric<IColor>(cMapping.color, colors);

      return {
        ...obj,
        color: colorObj.value,
        name: entity.name,
        slug: entity.name,
        detail: cMapping.name
      };
    });
    const legend: DH.ILegendField[] = cMappings.map(cMapping => {
      if (!cMapping.color) {
        throw new Error(`color value is missing for ${JSON.stringify(cMapping)}`);
      }
      const colorObj = getEntityByIdGeneric<IColor>(cMapping.color, colors);
      const hslColor = hsl(colorObj.value);
      const textColor = (hslColor.l > 0.7) ? 'black' : 'white';

      return { color: textColor, backgroundColor: colorObj.value, label: cMapping.name };
    });

    return { mapData, legend: R.append(Maps.noDataLegendEntry, legend) };
  }

  private async dataRevDataProcessing(concept: IConcept): Promise<IMapDataWithLegend> {
    if (concept.theme !== 'data-revolution') {
      throw new Error(`please cross check the concept details for ${concept.id}`);
    }
    const table = concept.id;
    const args = { ...concept, query: dataRevolution, db: this.db, table };
    const data: IRAWDataRevolution[] = await getIndicatorDataSimple<IRAWDataRevolution>(args);
    const processedData: IDataRevolution[] = indicatorDataProcessingSimple<IDataRevolution>(data);
    const dataRevColorMaps = await getDataRevolutionColors();
    const dataRevColorMap: IRevolutionColorMap = getEntityByIdGeneric<IRevolutionColorMap>(table, dataRevColorMaps);
    const colors = await getColors();
    const entities: IEntity[] = await getEntities();
    const mapData = processedData.map(obj => {
      // TODO:  temp color map
      const newDataColors = { red: 'green-lighter', orange: 'green', green: 'green-dark', grey: 'grey-light' };
      const newColor = newDataColors[obj.colour];
      const colorObj: IColor = getEntityByIdGeneric<IColor>(newColor, colors);
      const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);

      return {
        ...obj,
        detail: obj.detail.toString(),
        value: null,
        year: 0, // make ts happy
        slug: entity.slug,
        name: entity.name,
        color: colorObj.value
      };
    });
    const legend = R.keys(dataRevColorMap).reduce((acc: DH.ILegendField[], key) => {
      if (key === 'id') { return acc; }
      if (key === 'grey-light') { return acc; }
      const colorObj: IColor = getEntityByIdGeneric<IColor>(key, colors);
      const hslColor = hsl(colorObj.value);
      const textColor = (hslColor.l > 0.7) ? 'black' : 'white';

      return [
        ...acc,
        { backgroundColor: colorObj.value, color: textColor, label: dataRevColorMap[key] }
      ];
    }, []);

    return { mapData, legend: R.append(Maps.noDataLegendEntry, legend) };
  }
}

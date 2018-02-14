export interface IColorMap {
    high: string;
    low: string;
}
export interface IRAWDataRevolution {
    detail: string; // this is year
    colour: string;
    di_id: string;
}
export interface IDataRevolution {
    detail: number; // this is year
    colour: string;
    id: string;
    uid: string;
}
export interface ICategoricalMapping {
    id: string;
    name: string;
    color?: string;
}
export interface IRAWMapData {
    id?: string;
    district_id?: string;
    budget_type?: string;
    value: string | number;
    year: string;
}
export interface IMapDataWithLegend {
    mapData: DH.IMapUnit[];
    legend: DH.ILegendField[];
}
export interface IColorScaleArgs {
    rangeStr: string;
    ramp: IColorMap;
    isHighBetter?: boolean;
}
export interface IScaleThreshold <Input, Output> {
    (value: Input): Output;
    range(): Output[];
    domain(): Input[];
}

export interface IProcessScaleData {
    scale: IScaleThreshold<number, string>;
    data: IRAWMapData[];
    country: string;
}

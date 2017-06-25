// This file is auto generated by the gqlToTs.ts module
// tslint:disable
// graphql typescript definitions

declare namespace DH {
  interface IGraphQLResponseRoot {
    data?: IQuery;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /*
    description: 
  */
  interface IQuery {
    getCountryProfilePageData: Array<IPage> | null;
    getGlobalPicturePageData: Array<IPage> | null;
    getGlobalPictureThemes: Array<ITheme> | null;
    getOdaDonorBubbleChartPageData: Array<IPage> | null;
    getPovertyBubbleChartPageData: Array<IPage> | null;
    getSpotlightUgandaPageData: Array<IPage> | null;
    getUnbundlingOdaPageData: Array<IPage> | null;
    getUnbundlingOOfPageData: Array<IPage> | null;
    getWhereThePoorPageData: Array<IPage> | null;
    getRevenuePerPersonAndPoverty190: Array<IRevenuePerPersonAndPoverty190> | null;
    getBubbleSize: Array<IBubbleSize> | null;
    getOverViewTab: OverViewTab | null;
    getPovertyTab: IPovertyTab | null;
    getPopulationTab: IPopulationTab | null;
    getGovernmentFinance: IGovernmentFinance | null;
    getInternationalResources: IInternationalResources | null;
    getMapData: IAggregatedMap | null;
    getMethodologies: Array<IDataSources> | null;
    getWhereThePoorWillbeData: IWhereThePoorWillbe | null;
    getUnbundlingAid: Array<IAggregatedAid> | null;
  }

  /*
    description: 
  */
  interface IPage {
    id: string | null;
    title: string | null;
    narrative: string | null;
  }

  /*
    description: 
  */
  interface ITheme {
    id: string | null;
    name: string | null;
    default: string | null;
    order: number | null;
  }

  /*
    description: 
  */
  interface IRevenuePerPersonAndPoverty190 {
    id: string | null;
    year: number | null;
    poverty: number | null;
    revenuePerPerson: number | null;
  }

  /*
    description: 
  */
  interface IBubbleSize {
    id: string | null;
    year: number | null;
    value: number | null;
  }

  /*
    description: 
  */
  type OverViewTab = IOverViewTabRecipients | IOverViewTabDonors;



  /*
    description: 
  */
  interface IOverViewTabRecipients {
    poorestPeople: string | null;
    population: string | null;
    domesticPublicResources: string | null;
    internationalResources: string | null;
    governmentSpendPerPerson: string | null;
  }

  /*
    description: 
  */
  interface IOverViewTabDonors {
    governmentSpendPerPerson: string | null;
    averageIncomerPerPerson: Array<IIndicatorData> | null;
    incomeDistTrend: Array<IQuintile> | null;
  }

  /*
    description: 
  */
  interface IIndicatorData {
    year: number | null;
    Value: number | null;
    id: string | null;
  }

  /*
    description: 
  */
  interface IQuintile {
    value: number | null;
    quintileName: string | null;
  }

  /*
    description: 
  */
  interface IPovertyTab {
    poverty190Trend: Array<IIndicatorData> | null;
    depthOfExtremePoverty: number | null;
    IncomeDistTrend: Array<IIndicatorData> | null;
  }

  /*
    description: 
  */
  interface IPopulationTab {
    population: string | null;
    populationDistribution: Array<IPopulationDistribution> | null;
    populationPerAgeBand: Array<IPopulationPerAgeBand> | null;
  }

  /*
    description: 
  */
  interface IPopulationDistribution {
    group: string | null;
    value: number | null;
    year: number | null;
  }

  /*
    description: 
  */
  interface IPopulationPerAgeBand {
    band: string | null;
    value: number | null;
    year: number | null;
  }

  /*
    description: 
  */
  interface IGovernmentFinance {
    totalRevenue: number | null;
    totalGrants: number | null;
    currencyType: string | null;
    spendingAllocation: Array<IIndicatorData> | null;
    revenueAndGrants: Array<IDomestic> | null;
    expenditure: Array<IDomestic> | null;
    financing: Array<IDomestic> | null;
  }

  /*
    description: 
  */
  interface IDomestic {
    title: string | null;
    levels: Array<string> | null;
    budgetType: string | null;
    level: number | null;
    year: number | null;
    value: number | null;
  }

  /*
    description: 
  */
  interface IInternationalResources {
    GNI: number | null;
    netODAOfGNI: number | null;
    resourceOverTimeInflows: Array<IResourceData> | null;
    resourceOverTimeOutflows: Array<IResourceData> | null;
    inflows: Array<string> | null;
    outflows: Array<string> | null;
  }

  /*
    description: 
  */
  interface IResourceData {
    year: number | null;
    Value: number | null;
    id: string | null;
    category: string | null;
    typeName: string | null;
  }

  /*
    description: 
  */
  interface IAggregatedMap {
    map: Array<IMapUnit> | null;
    name: string | null;
    uomDisplay: string | null;
    uom: string | null;
    startYear: number | null;
    endYear: number | null;
    description: string | null;
    theme: string | null;
    color: string | null;
    total: number | null;
  }

  /*
    description: 
  */
  interface IMapUnit {
    id: string | null;
    countryName: string | null;
    year: number | null;
    value: number | null;
  }

  /*
    description: 
  */
  interface IDataSources {
    name: string | null;
    Description: string | null;
    methodology: string | null;
    unit: string | null;
    source: string | null;
    download: IDownload | null;
  }

  /*
    description: 
  */
  interface IDownload {
    csv: string | null;
    zip: string | null;
  }

  /*
    description: 
  */
  interface IWhereThePoorWillbe {
    global: Array<ILevelData> | null;
    regional: Array<ILevelData> | null;
  }

  /*
    description: 
  */
  interface ILevelData {
    poverty: number | null;
    scenario: string | null;
    year: number | null;
    typeName: string | null;
  }

  /*
    description: 
  */
  type IUnbundlingAidTypeEnum = 'ODA' | 'OOF';

  /*
    description: 
  */
  interface IAggregatedAid {
    aids: Array<IAid> | null;
    total: number | null;
    toCountries: Array<string> | null;
    fromCountries: Array<string> | null;
    channels: Array<string> | null;
    form: Array<string> | null;
  }

  /*
    description: 
  */
  interface IAid {
    year: number | null;
    Value: number | null;
    id: string | null;
  }

  /*
    description: 
  */
  interface IGovtRevenuePerPerson {
    id: string | null;
    year: number | null;
    value: number | null;
    type: string | null;
  }

  /*
    description: 
  */
  interface IPoverty190 {
    id: string | null;
    year: number | null;
    value: number | null;
  }
}

// tslint:enable

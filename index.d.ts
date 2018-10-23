// This file is auto generated by the gqlToTs.ts module
// tslint:disable
// graphql typescript definitions

declare namespace DH {
  interface IGraphQLResponseRoot {
    data?: IQuery;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string; // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any; // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    bubbleChartOda: Array<IBubbleChartOda> | null;
    bubbleChartPoverty: Array<IBubbleChartPoverty> | null;
    bubbleChartOptions: IBubbleChartOptions | null;
    overviewTab: IOverviewTab | null;
    povertyTab: IPovertyTab | null;
    populationTab: IPopulationTab | null;
    governmentFinance: IGovernmentFinance | null;
    internationalResources: IInternationalResources | null;
    /**
    eg recipient or donor
  */
    flows: IFlows | null;
    /**
    for area tree map chart dropdown selectoion
  */
    singleResource: ISingleResourceData | null;
    mapData: IMapData | null;
    /**
    id is district slug
  */
    overviewTabRegional: IOverviewTabRegional | null;
    povertyTabRegional: PovertyTabRegional | null;
    populationTabRegional: PopulationTabRegional | null;
    educationTabRegional: EducationTabRegional | null;
    healthTabRegional: HealthTabRegional | null;
    localGovernmentFinance: ILocalGovernmentFinance | null;
    unbundlingAidDataTotal: IUnbundlingAidTotal | null;
    unbundlingAidData: Array<IAidUnit> | null;
    unbundlingSelectionData: IUnbundlingAidSelections | null;
    methodology: Array<IMethodology> | null;
    countries: Array<IEntity> | null;
    districtPageData: Array<IPage> | null;
    countryProfilePageData: Array<IPage> | null;
    odaDonorBubbleChartPageData: Array<IPage> | null;
    globalPicturePageData: Array<IPage> | null;
    povertyBubbleChartPageData: Array<IPage> | null;
    unbundlingOdaPageData: Array<IPage> | null;
    unbundlingOOfPageData: Array<IPage> | null;
    whereThePoorPageData: Array<IPage> | null;
    districts: Array<IDistrict> | null;
    globalPictureThemes: Array<ITheme> | null;
    spotlightThemes: Array<ITheme> | null;
  }

  interface IBubbleChartOda {
    year: number | null;
    /**
    country id
  */
    id: string | null;
    /**
    country name
  */
    name: string | null;
    income_group: string | null;
    region: string | null;
    uid: string | null;
    value: number | null;
    revenuePerPerson: number | null;
    numberInExtremePoverty: number | null;
  }

  interface IBubbleChartPoverty {
    year: number | null;
    value: number | null;
    id: string | null;
    name: string | null;
    income_group: string | null;
    region: string | null;
    uid: string | null;
    revenuePerPerson: number | null;
    numberInExtremePoverty: number | null;
    percentageInExtremePoverty: number | null;
  }

  interface IBubbleChartOptions {
    /**
    this list feeds off oda table from countries and global/concept file
IdNamePair is defined in unbundling aid types
  */
    indicators: Array<IIdNamePair>;
    incomeGroups: Array<IIdNamePair>;
    regions: Array<IRegion>;
  }

  interface IIdNamePair {
    id: string;
    name: string;
  }

  interface IRegion {
    name: string | null;
    id: string | null;
    color: string | null;
  }

  interface IOverviewTab {
    /**
    how many of the poorest people globally live in a country
  */
    poorestPeople: IIndicatorValueWithToolTip | null;
    /**
    total population for a given country
  */
    population: IIndicatorValueWithToolTip | null;
    domesticResources: IIndicatorValueWithToolTip | null;
    internationalResources: IIndicatorValueWithToolTip | null;
    /**
    recipient countries $PPP, both donor and recipient
  */
    governmentSpendPerPerson: IIndicatorValueWithToolTip | null;
    /**
    donor: gross nation income per capit GNI
  */
    averageIncomerPerPerson: IIndicatorDataWithToolTip | null;
    /**
    donor: Income share by quintile
  */
    incomeDistTrend: IQuintileDataWithToolTip | null;
  }

  interface IIndicatorValueWithToolTip {
    value: string | null;
    toolTip: IToolTip;
  }

  interface IToolTip {
    source: string;
    heading: string;
  }

  interface IIndicatorDataWithToolTip {
    data: Array<IIndicatorData>;
    toolTip: IToolTip;
  }

  interface IIndicatorData {
    year: number;
    value: number | null;
    id: string;
    name: string;
    color: string | null;
    uid: string;
  }

  interface IQuintileDataWithToolTip {
    data: Array<IQuintile>;
    toolTip: IToolTip | null;
  }

  interface IQuintile {
    value: number;
    quintileName: string;
    uid: string;
    color: string;
  }

  interface IPovertyTab {
    /**
    Poverty reduction over time area chart trend
  */
    poverty190Trend: IIndicatorDataWithToolTip | null;
    /**
    how deep is poverty %
  */
    depthOfExtremePoverty: IIndicatorValueWithToolTip | null;
    /**
    Recipients: how income is distributed, % of income received by each quintil
  */
    incomeDistTrend: IQuintileDataWithToolTip | null;
  }

  interface IPopulationTab {
    /**
    total population in a country
  */
    population: IIndicatorValueWithToolTip | null;
    /**
    Urban vs Rural population level
  */
    populationDistribution: IPopulationDistributionWithToolTip | null;
    /**
    Number of people in 3 age bands (65+, 15- 65, 0 - 14)
  */
    populationPerAgeBand: IPopulationPerAgeBandWithToolTip | null;
  }

  interface IPopulationDistributionWithToolTip {
    data: Array<IPopulationDistribution>;
    toolTip: IToolTip;
  }

  interface IPopulationDistribution {
    group: string;
    value: number;
    year: number;
  }

  interface IPopulationPerAgeBandWithToolTip {
    data: Array<IPopulationPerAgeBand>;
    toolTip: IToolTip;
  }

  interface IPopulationPerAgeBand {
    band: string;
    value: number;
    year: number;
    uid: string;
  }

  interface IGovernmentFinance {
    startYear: number;
    /**
    Total revenue for a particular
  */
    totalRevenue: IIndicatorValueWithToolTip | null;
    grantsAsPcOfRevenue: IIndicatorValueWithToolTip | null;
    /**
    for donut chart
  */
    spendingAllocation: ISpendingAllocationWithToolTip | null;
    /**
    for treemap
such as constant 2015 USD for tree map
  */
    currencyCode: string | null;
    currencyUSD: string | null;
    supportLocalCurrencyOnly: boolean;
    /**
    use resourcesRecipient sql
  */
    expenditure: Array<IDomestic> | null;
    revenueAndGrants: Array<IDomestic> | null;
    finance: Array<IDomestic> | null;
  }

  interface ISpendingAllocationWithToolTip {
    data: Array<ISpendingAllocation> | null;
    toolTip: IToolTip;
  }

  interface ISpendingAllocation {
    value: number;
    name: string;
    color: string;
    uid: string;
  }

  interface IDomestic {
    /**
    eg Actual or budget
  */
    budget_type: string;
    levels: Array<string>;
    year: number;
    value: number | null;
    value_ncu: number | null;
    uid: string;
    color: string;
  }

  interface IInternationalResources {
    startYear: number;
    /**
    Gross National Income
  */
    GNI: IIndicatorValueWithToolTip | null;
    /**
    Net ODA received, % of GNI for recipient countries
  */
    netODAOfGNIIn: IIndicatorValueWithToolTip | null;
    /**
    Net ODA out, % of GNI for recipient countries
  */
    netODAOfGNIOut: IIndicatorValueWithToolTip | null;
    /**
    for line chart in the  international resources tabs section,
IndicatorDataColoredWithToolTip  is defined in spotlight types
  */
    resourceflowsOverTime: IFlowsOverTimeWithToolTip;
    /**
    for sidebar chart in international resources section & area partition tree chart default data
  */
    resourcesOverTime: IResourceDataWithToolTip;
    /**
    Whats the mix of resources can be for donors (out flows) or receipient (in flows)
this is for the donut chart
  */
    mixOfResources: IResourceDataWithToolTip;
  }

  interface IFlowsOverTimeWithToolTip {
    data: Array<IIndicatorData>;
    toolTip: IToolTip;
  }

  interface IResourceDataWithToolTip {
    data: Array<IResourceData>;
    toolTip: IToolTip;
  }

  interface IResourceData {
    year: number;
    value: number;
    flow_name: string;
    flow_id: string;
    /**
    a position value for a flow generated from flow_type, flow_category and flow name order
  */
    position: number;
    short_name: string;
    /**
    Category i.e FDI, ODA
  */
    flow_category: string;
    /**
    flow either inflow or outflow
  */
    flow_type: string;
    /**
    i.e contains flow type as 1st level, flow category as second and flow name as 3rd
levels: [String]
in or out
  */
    direction: string;
    color: string;
    uid: string;
  }

  interface IFlows {
    /**
    an array of inflows for a particular countryType for area & partition chart
  */
    inflows: Array<IFlow>;
    /**
    an array of outflows for a particular countryType
  */
    outflows: Array<IFlow>;
  }

  interface IFlow {
    name: string;
    id: string;
    selections: Array<IFlowSelection>;
  }

  interface IFlowSelection {
    name: string;
    /**
    this is the group ID
  */
    id: string;
    unbundle: boolean;
  }

  interface ISingleResourceData {
    resources: Array<IIndicatorData>;
    color: string;
  }

  interface IMapData {
    map: Array<IMapUnit>;
    /**
    map indicator user friendly label / slug eg Poverty
  */
    name: string;
    /**
    map value unit eg US $ or %
  */
    uom_display: string;
    uom: string;
    map_style: string | null;
    start_year: number;
    end_year: number;
    default_year: number;
    description: string | null;
    source: string;
    theme: string;
    heading: string;
    country: string;
    id: string;
    legend: Array<ILegendField>;
  }

  interface IMapUnit {
    /**
    country code Id in DW this is di_id
  */
    id: string;
    /**
    country slug
  */
    slug: string;
    /**
    countryName derived from entity.csv
  */
    name: string;
    year: number;
    color: string | null;
    value: number | null;
    detail: string | null;
    uid: string;
  }

  interface ILegendField {
    label: string;
    color: string;
    backgroundColor: string;
  }

  interface IOverviewTabRegional {
    /**
    WHAT PERCENTAGE OF PEOPLE IN WAKISO LIVE BELOW THE NATIONAL POVERTY LINE?
can be no data or '12%'
  */
    poorestPeople: IIndicatorValueWithToolTip | null;
    /**
    WHAT RESOURCES ARE AVAILABLE TO LOCAL GOVERNMENTS IN WAKISO? eg 3.6m or 2.7bn
this is a total of local, donor and central government resources
  */
    regionalResources: IIndicatorValueNCUWithToolTip | null;
    /**
    IndicatorDataColored is defined in country profile types
has local government, donor and central government
  */
    regionalResourcesBreakdown: Array<IResourcesBreakDown> | null;
    /**
    HOW MUCH DOES THE LOCAL GOVERNMENT SPEND PER PERSON?
  */
    localGovernmentSpendPerPerson: IIndicatorValueWithToolTip | null;
  }

  interface IIndicatorValueNCUWithToolTip {
    value: string | null;
    value_ncu: string | null;
    toolTip: IToolTip;
  }

  interface IResourcesBreakDown {
    data: IIndicatorData;
    toolTip: IToolTip;
  }

  type PovertyTabRegional = IPovertyTabUg | IPovertyTabKe;

  interface IPovertyTabUg {
    poorestPeople: IIndicatorValueWithToolTip | null;
    /**
    WHAT IS THE AVERAGE LIFE EXPECTANCY?
  */
    lifeExpectancy: IIndicatorValueWithToolTip | null;
    /**
    WHAT IS THE STANDARD OF LIVING SCORE?
  */
    stdOfLiving: IIndicatorValueWithToolTip | null;
  }

  interface IPovertyTabKe {
    poorestPeople: IIndicatorValueWithToolTip | null;
    /**
    WHAT IS THE AVERAGE LIFE EXPECTANCY?
  */
    meanExpenditure: IIndicatorValueWithToolTip | null;
    /**
    WHAT IS THE STANDARD OF LIVING SCORE?
  */
    povertyGap: IIndicatorValueWithToolTip | null;
  }

  type PopulationTabRegional =
    | IPopulationTabRegionalUg
    | IPopulationTabRegionalKe;

  interface IPopulationTabRegionalUg {
    /**
    The total population of a given district and the population density in per sq km
  */
    totalPopulation: IIndicatorValueWithToolTip | null;
    populationDensity: IIndicatorValueWithToolTip | null;
    /**
    Urban vs Rural population level
  */
    populationDistribution: IPopulationDistributionWithToolTip | null;
    averageDependencyRatio: IIndicatorValueWithToolTip | null;
    allAverageDependencyRatio: IIndicatorValueWithToolTip | null;
  }

  interface IPopulationTabRegionalKe {
    /**
    The total population of a given district and the population density in per sq km
  */
    totalPopulation: IIndicatorValueWithToolTip | null;
    populationDensity: IIndicatorValueWithToolTip | null;
    populationBirthRate: IIndicatorValueWithToolTip | null;
  }

  type EducationTabRegional = IEducationTabRegionalUg | IEducationTabRegionalKe;

  interface IEducationTabRegionalUg {
    /**
    WHAT IS THE PUPIL–TEACHER RATIO IN PRIMARY EDUCATION?...in government schools  and...in all schools
  */
    pupilTeacherRatioGovtSchl: IIndicatorValueWithToolTip | null;
    pupilTeacherRatioOtherSchl: IIndicatorValueWithToolTip | null;
    /**
    WHAT PERCENTAGE OF STUDENTS PASS THE PRIMARY LEAVING EXAM?
  */
    studentsPassRate: IIndicatorValueWithToolTip | null;
    studentsPassDistrictRank: IIndicatorValueWithToolTip | null;
    /**
    HOW MUCH PRIMARY EDUCATION FUNDING IS THERE?
  */
    primaryEducationfunding: IIndicatorValueNCUWithToolTip | null;
  }

  interface IEducationTabRegionalKe {
    /**
    WHAT IS THE PUPIL–TEACHER RATIO IN PRIMARY EDUCATION?...in government schools  and...in all schools
  */
    primaryPupilTeacherRatioAllSchl: IIndicatorValueWithToolTip | null;
    primaryTeacherRatioPublicSchl: IIndicatorValueWithToolTip | null;
    primaryTeacherRatioPrivateSchl: IIndicatorValueWithToolTip | null;
  }

  type HealthTabRegional = IHealthTabRegionalKe | IHealthTabRegionalUg;

  interface IHealthTabRegionalKe {
    birthAttendanceSkilled: IIndicatorValueWithToolTip | null;
    contraceptiveUse: IIndicatorValueWithToolTip | null;
    healthCareFunding: IIndicatorValueNCUWithToolTip | null;
  }

  interface IHealthTabRegionalUg {
    /**
    WHAT IS THE DISTRICT LEAGUE HEALTH PERFORMANCE SCORE?
  */
    districtPerformance: IIndicatorValueWithToolTip | null;
    /**
    WHAT PERCENTAGE OF TUBERCULOSIS CASES HAVE BEEN SUCCESSFULLY TREATED?
  */
    treatmeantOfTb: IIndicatorValueWithToolTip | null;
    districtHealthRank: IIndicatorValueWithToolTip | null;
    /**
    HOW MUCH LOCAL GOVERNMENT HEALTHCARE FUNDING IS THERE?
  */
    healthCareFunding: IIndicatorValueNCUWithToolTip | null;
  }

  interface ILocalGovernmentFinance {
    startYear: number;
    currencyUSD: string;
    currencyCode: string;
    supportLocalCurrencyOnly: boolean;
    /**
    come from finance file
  */
    revenueAndGrants: Array<IDomestic>;
    expenditure: Array<IDomestic>;
  }

  interface IUnbundlingAidToTalQuery {
    /**
    oda or oof
  */
    aidType: string;
    year?: number | null;
  }

  interface IUnbundlingAidTotal {
    year: number;
    total: string;
  }

  interface IUnbundlingAidQuery {
    /**
    oda or oof
  */
    aidType: string;
    year: number;
    /**
    eg channel, bundle
  */
    groupBy: string;
    to_di_id?: string | null;
    from_di_id?: string | null;
    /**
    form is same as buddle
  */
    bundle?: string | null;
    sector?: string | null;
    channel?: string | null;
  }

  interface IAidUnit {
    /**
    this will usually be a summed up aggregate value
  */
    value: number;
    /**
    country or organisation or channel or bundle name
  */
    name: string;
    color: string;
    id: string;
    year: number;
    uid: string;
  }

  interface IUnbundlingAidSelections {
    /**
    unbundling aid selection options
  */
    to: Array<IIdNamePair>;
    from: Array<IIdNamePair>;
    channels: Array<IIdNamePair>;
    sectors: Array<IIdNamePair>;
    /**
    same as form
  */
    bundles: Array<IIdNamePair>;
    years: Array<number>;
  }

  interface IMethodology {
    name: string;
    description: string;
    methodology: string;
    /**
    think units
  */
    uom: string | null;
    source: ISource | null;
    csv: string;
    zip: string;
  }

  interface ISource {
    name: string;
    link: string | null;
  }

  interface IEntity {
    id: string;
    name: string;
    slug: string;
    has_domestic_data: string;
    hasPDF: boolean;
    countryType: string;
  }

  interface IPage {
    id: string;
    title: string;
    narrative: string | null;
    donor_title: string | null;
  }

  interface IDistrict {
    id: string;
    name: string;
  }

  interface ITheme {
    id: string;
    name: string;
    default_indicator: string;
    indicators: Array<IThemeIndicator>;
  }

  interface IThemeIndicator {
    heading: string;
    source: string;
    tooltip: string;
    id: string;
    name: string;
  }

  interface IBubbleChartData {
    year: number | null;
    id: string | null;
    name: string | null;
    income_group: string | null;
    region: string | null;
    value: number | null;
    uid: string | null;
  }
}

// tslint:enable

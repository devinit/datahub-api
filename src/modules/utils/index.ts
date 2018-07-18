import * as R from 'ramda';
import { IConcept, getConceptAsync } from '../refs/concept';
import { IDistrict, getDistrictBySlugAsync } from '../refs/spotlight';
import * as shortid from 'shortid';
import { IColor, ICurrency, IEntity, getBundles, getChannels, getColors,
        getCreditorType, getCurrency, getDestinationInstitutionType, getEntities,
        getEntityByIdGeneric, getEntityBySlugAsync, getFinancingType, getFlowType, getSectors } from '../refs/global';
import { isError } from '@devinit/prelude';
import { IBudgetLevelRef, getBudgetLevels } from '../refs/countryProfile';
import { IGetIndicatorArgs, IGetIndicatorArgsSimple, IGetIndicatorValueArgs, IMissingDomesticParent,
        IProcessedSimple, IRAW, IRAWDomestic, ISpotlightGetIndicatorArgs,
        IToolTipArgs, IhasDiId } from './types';
import { approximate, getTableNameFromSql, toId, toNumericFields } from '@devinit/prelude';

export const RECIPIENT = 'recipient';
export const DONOR = 'donor';
export const MULTILATERAL = 'multilateral';
export const  CROSSOVER = 'crossover';
// TODO: should get from a refrence file
export const  budgetTypesRefs = {
    actual: 'Actual',
    estimated: 'Estimated',
    proposed: 'Proposed',
    approved: 'Approved',
    budget: 'Budget',
    proj: 'Projected'
};
export const entitesFnMap = {
    sector: getSectors,
    channel: getChannels,
    bundle: getBundles,
    destination_institution_type: getDestinationInstitutionType,
    financing_type: getFinancingType,
    creditor_type: getCreditorType,
    to: getEntities,
    flow_type: getFlowType,
    from_di_id:  getEntities,
    to_di_id: getEntities,
    from: getEntities
};

export const getCurrencyCode = async (id: string): Promise<string>  => {
    try {
        const currencyList: ICurrency[] = await getCurrency();
        const entity: IEntity | undefined = await getEntityBySlugAsync(id);
        if (!entity) { throw new Error(`entity was not found for slug: ${id}`); }
        const currency: ICurrency | undefined = R.find(R.propEq('id', entity.id), currencyList) as ICurrency;
        return currency ? currency.code : 'NCU';
    } catch (error) {
        throw error;
    }
};

export const getSpotlightTableName = (country: string, query: string): string => {
    const tableStr = getTableNameFromSql(query);
    if (isError(tableStr)) { throw new Error(`error getting table name for : ${query}`); }
    const schema =  `spotlight_on_${country}`;
    return tableStr
            .replace(/\${schema\^}/, schema)
            .replace(/\${country\^}/, country);
};

export const getIndicatorToolTip = async ({ query, conceptType, id }: IToolTipArgs): Promise<DH.IToolTip> => {
    const country: string = conceptType.includes('spotlight-') ?  conceptType.split('-')[1] : '';
    let indicatorId: string = id || '';
    if (query) {
        const eitherId: string | Error = !country ? getTableNameFromSql(query) : getSpotlightTableName(country, query);
        if (isError(eitherId)) { throw new Error (`failed to get indicator id from sql query; ${indicatorId}`); }
        indicatorId = eitherId as string;
    }
    const concept: IConcept = await getConceptAsync(conceptType, indicatorId);
    return { source: concept.source, heading: concept.description || concept.heading };
};

// used by country profile and spotlights
export async function getIndicatorData<T>(opts: IGetIndicatorArgs): Promise<T[]> {
    const { db, query, id, conceptType, table } = opts;
    const tableName = !table ? getTableNameFromSql(query) : table;
    if (isError(tableName)) { throw Error(`error getting table name: ${query}`); }
    let countryEntity: any = {};
    if (conceptType === 'country-profile' && id) { countryEntity =  await getEntityBySlugAsync(id); }
    let theme =  conceptType === 'country-profile' ? countryEntity.donor_recipient_type : undefined;
    if (theme === 'crossover') { theme = RECIPIENT; }
    const concept: IConcept = await getConceptAsync(conceptType, tableName, theme);
    const baseQueryArgs = { ...concept, ...opts, table: tableName };
    if (conceptType === 'country-profile') {
        const queryArgs = { ...baseQueryArgs, id: countryEntity.id };
        return db.manyCacheable(query, queryArgs);
    }
    return db.manyCacheable(query, baseQueryArgs);
}

// used by spotlights
export async function getIndicatorDataSpotlights<T>(opts: ISpotlightGetIndicatorArgs): Promise<T[]> {
    const { db, query, id, conceptType, country, table } = opts;
    const tableName = !table && country && query ? getSpotlightTableName(country, query) : table;
    if (!tableName) { throw new Error('Provide a valid table name or query string'); }
    const spotlightEntity: IDistrict =  await getDistrictBySlugAsync(country, id);
    const concept: IConcept = await getConceptAsync(conceptType, tableName);
    const queryArgs = { ...opts, ...concept, id: spotlightEntity.id, country };
    return db.manyCacheable(query, queryArgs);
}

export const getIndicatorsValue = async ({ id, sqlList, db, format = true, precision }: IGetIndicatorValueArgs)
    : Promise<DH.IIndicatorValueWithToolTip[]>  => {
    try {
        const indicatorArgs: IGetIndicatorArgs[] =
                sqlList.map(query => ({ db, conceptType: 'country-profile', query, id }));
        const indicatorRaw: IRAW[][] = await Promise.all(indicatorArgs.map(args => getIndicatorData<IRAW>(args)));
        const toolTips: DH.IToolTip[] =
            await Promise.all(indicatorArgs.map(args => getIndicatorToolTip(args)));
        const precisionFix = precision !== undefined ? precision : 1;
        return indicatorRaw.map((data, index) => {
            const toolTip = toolTips[index];
            let value = 'No data';
            if (data && data[0] && data[0].value && format) { value = approximate(data[0].value, precisionFix, true); }
            if (data && data[0] && data[0].value && !format) { value = Math.round(Number(data[0].value)).toString(); }
            return { value, toolTip };
        });
    } catch (error) {
        throw error;
    }
};

// used by maps module
export const getIndicatorDataSimple = async <T extends {}> (opts: IGetIndicatorArgsSimple): Promise<T[]> => {
  const { table, sql, db, query, start_year, end_year } = opts;
  let queryStr = '';
  if (!query && sql) {
    queryStr = Number(end_year) ? sql.indicatorRange : sql.indicator;
  }
  if (query) {
    queryStr = query;
  }
  const tableName = table || getTableNameFromSql(queryStr);
  if (isError(tableName)) {
    throw new Error('No valid table name provided');
  }
  if (!queryStr.length) {
    throw new Error('invalid query string');
  }

  return db.manyCacheable(queryStr, { start_year, end_year, table: formatTableName(tableName) });
};

export const formatTableName = (tableName: string): string => {
  return tableName.split('.').map(portion => `"${portion}"`).join('.');
};

export const indicatorDataProcessingSimple = <T extends {}>(data: any, country?: string): T[] => {
  return data
    .map(toId)
    .map((obj) =>
      country === 'global' || !country ? obj : { ...obj, id: obj.district_id })
    .map(obj => ({ ...obj, uid: shortid.generate() }))
    .map(toNumericFields);
};

// adds reference names to Ids
export const indicatorDataProcessingNamed = async (data: IhasDiId[]):
    Promise<DH.IIndicatorData[]> => {
    const processed: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
    const entities: IEntity[] =  await getEntities();
    return processed.map(obj => {
        const entity = getEntityByIdGeneric<IEntity>(obj.id, entities);
        return { ...obj, name: entity.name, uid: shortid.generate(), color: null };
    });
};
export const addColorToDomesticLevels =
    (levels: string[], budgetRefs: IBudgetLevelRef[], colors: IColor[]): string => {
        const levelRefs =
            levels
            .map(level => budgetRefs.find(ref => ref.name === level)) as IBudgetLevelRef[];
        const colorObjs: IColor[] =
            levelRefs
            .map(levelRef => {
                const levelRefColor = levelRef && levelRef.color ? levelRef.color : 'blue-light';
                return getEntityByIdGeneric(levelRefColor, colors);
            });
        if (levels.length < 2) { return colorObjs[0].value; } // we only use the 1st and 2nd level colors
        return colorObjs[1].value;
};
export const domesticDataProcessing = async (data: IRAWDomestic[], country?: string)
    : Promise<DH.IDomestic[]> => {
    const budgetRefs: IBudgetLevelRef[] = country ? await getBudgetLevels(country) : await getBudgetLevels();
    const colors: IColor[] = await getColors();
    return indicatorDataProcessingSimple(data)
            .map((obj: any) => { // TODO: make type for IRAWDomestic processed
                const levelKeys: string[] = R.keys(obj).filter(key => R.test(/^l[0-9]/, key));
                if (!levelKeys) { throw new Error(`Levels missing in budget data ${JSON.stringify(obj)}`); }
                const levels = levelKeys.map(key => {
                    const budgetLevel: IBudgetLevelRef | undefined = budgetRefs.find(ref => ref.id === obj[key]);
                    if (!budgetLevel) {  return obj[key]; }
                    return budgetLevel.name;
                }).filter(level => level !== null);
                const color = addColorToDomesticLevels(levels, budgetRefs, colors);
                const uid: string = shortid.generate();
                const budget_type = budgetTypesRefs[obj.budget_type];
                return { ...obj, budget_type, uid, levels, color } as DH.IDomestic;
            });
};

export const isDonor = async (slug: string): Promise<boolean>  => {
    const obj: IEntity | undefined = await getEntityBySlugAsync(slug);
    if (!obj) { throw new Error('Error in isDonor function, entity is undefined'); }
    if (obj.donor_recipient_type === DONOR) { return true; }
    return false;
};

export const makeSqlAggregateQuery = (queryArgs: any, groupByField: string, table: string): string => {
        const queryArgsKeys = R.keys(queryArgs);
        return queryArgsKeys.reduce((query, field, index) => {
            const AND = index + 1 < queryArgsKeys.length ? 'AND' : `GROUP BY ${groupByField}, year`;
            if (field === 'years' && queryArgs.years.length === 2) {
                 return `${query} year >= ${queryArgs.years[0]} AND year <= ${queryArgs.years[1]} ${AND}`;
            }
            return field === 'year' ? `${query} ${field} = ${queryArgs[field]} ${AND}`
                : `${query} ${field} = '${queryArgs[field]}' ${AND}`; // we need to enclose field values in quotes
        }, `SELECT ${groupByField}, year, sum(value) AS value from ${table} WHERE value > 0 AND`);
};

// A patch of domestic data with missing parent entries
// Ideally every entry in domestic table should have a parent entry i,e data of the form [l1: a, l2: b, l3:c]
// l1: a, l2: b, l3:d]  should have a corresponding entry with [l1: a, l2: b] as parent so to speak.
// solution find data with missing parent levels, get that datas children and sum it up to create new parent entry

export const missingParentsData = (data: DH.IDomestic[]): DH.IDomestic[][] => {
    return [ 3, 4 ].map((level) => {
        const levelParentData = data.filter(obj => obj.levels.length === level - 1);
        const levelChildrenData = data.filter(obj => obj.levels.length === level);
        // parents that are missing in the raw data
        const missingParents = levelChildrenData.map(child => {
            // for each child confirm it has a standalone parent
            const childParent = levelParentData.filter(parent => {
                // the last parent item in level 2 should be the 2nd last item in level 3
                return R.last(parent.levels) === R.last(R.init(child.levels));
            });
            if (!childParent.length) {
                return {
                    levels: R.init(child.levels),
                    uid: R.init(child.levels).join(''),
                    level: `l${level - 1}`,
                    child
                };
            }
            return undefined;
        })
        .filter(item => item && item.level) as IMissingDomesticParent[];
        // create the missing parents
        return missingParents.reduce((acc, obj) => {
            const baseParent = { ...obj.child, levels: obj.levels, uid: obj.uid };
            if (acc.length) {
                const similarParent = acc.find(parent => parent.uid === obj.uid);
                if (similarParent) {
                    const joinedParent = {
                        ...similarParent,
                        value: obj.child.value + similarParent.value,
                        value_ncu: obj.child.value_ncu + similarParent.value_ncu
                    };
                    // remove previous parent from list
                    const newParentsList = acc.filter(objP => objP.uid !== joinedParent.uid);
                    return [ ...newParentsList, joinedParent ];
                }
                return [ ...acc, baseParent ];
            }
            return [ baseParent ];
        }, [] as DH.IDomestic[]);
    });
};

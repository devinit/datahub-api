import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../../db';
import {kenya} from './sql';
import {getIndicatorsGeneric} from './utils';

const sql = kenya;
const getIndicatorsGenericKe = getIndicatorsGeneric('kenya');

export default class Uganda {
    private db: IDatabase<IExtensions> & IExtensions;
    constructor(db: any) {
        this.db = db;
    }

    public async getPopulationTabRegional({id}): Promise<DH.IPopulationTabRegionalKe> {
        try {
            const [totalPopulation, populationDensity, populationBirthRate]
             = await getIndicatorsGenericKe(id,
                [sql.totalPopulation, sql.populationDensity,
                sql.populationBirthRate]);
            return {
            totalPopulation,
            populationDensity,
            populationBirthRate
           };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async getPovertyTabRegional({id}): Promise<DH.IPovertyTabKe> {
        try {
            const [poorestPeople, povertyGap, meanExpenditure] =
                await getIndicatorsGenericKe(id, [sql.poorestPeople, sql.povertyGap, sql.meanExpenditure]);
            return {
                poorestPeople,
                povertyGap,
                meanExpenditure
            };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getEducationTabRegional({id}): Promise<DH.IEducationTabRegionalKe> {
         try {
            const [primaryPupilTeacherRatioAllSchl, primaryTeacherRatioPublicSchl,  primaryTeacherRatioPrivateSchl] =
                await getIndicatorsGenericKe(id, [sql.primaryPupilTeacherRatioAllSchl,
                    sql.primaryTeacherRatioPublicSchl,
                    sql. primaryTeacherRatioPrivateSchl]);
            return {
                primaryPupilTeacherRatioAllSchl,
                primaryTeacherRatioPublicSchl,
                primaryTeacherRatioPrivateSchl
          };
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getHealthTabRegional(id): Promise<DH.IHealthTabRegionalKe> {
        try {
            const [healthCareFunding,  birthAttendanceSkilled, contraceptiveUse] =
                await getIndicatorsGenericKe(id, [sql.healthCareFunding, sql.birthAttendanceSkilled,
                    sql.contraceptiveUse]);
            return {
                healthCareFunding,
                birthAttendanceSkilled,
                contraceptiveUse,
            };
       }    catch (error) {
           console.error(error);
           throw error;
       }
    }
}

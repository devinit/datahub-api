
import {IDB} from '@devinit/graphql-next/lib/db';
import {kenya} from './sql';
import {getIndicatorsGeneric, getLocalGovernmentFinance, GetIndicatorFn} from './utils';

const sql = kenya;
const country = 'kenya';
export default class Uganda {
    public getIndicatorsGeneric: GetIndicatorFn;
    private db: IDB;
    constructor(db: IDB) {
        this.db = db;
        this.getIndicatorsGeneric = getIndicatorsGeneric({country, db: this.db});
    }
    public async getLocalGovernmentFinance({id}): Promise<DH.ILocalGovernmentFinance> {
        return getLocalGovernmentFinance(this.db)({id, country, startYear: 2014});
    }
    public async getPopulationTabRegional({id}): Promise<DH.IPopulationTabRegionalKe> {
        try {
            const [totalPopulation, populationDensity, populationBirthRate]
             = await this.getIndicatorsGeneric(id,
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
                await this.getIndicatorsGeneric(id, [sql.poorestPeople, sql.povertyGap, sql.meanExpenditure]);
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
                await this.getIndicatorsGeneric(id, [sql.primaryPupilTeacherRatioAllSchl,
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
    public async getHealthTabRegional({id}): Promise<DH.IHealthTabRegionalKe> {
        try {
            const [healthCareFunding,  birthAttendanceSkilled, contraceptiveUse] =
                await this.getIndicatorsGeneric(id, [sql.healthCareFunding, sql.birthAttendanceSkilled,
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

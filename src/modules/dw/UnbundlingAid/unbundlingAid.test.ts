import * as prettyFormat from 'pretty-format';
import UnbundlingAid from '.';
import db from '../../../api/db';
import { replaceUidInList } from '@devinit/prelude';

describe('Unbundling aid DW module tests', () => {
    const unbundlingAid = new UnbundlingAid(db);

    it('getting unbundling aid data of various types', async () => {
        const argsA = { aidType: 'oda', year: 2016, groupBy: 'sector', from_di_id: 'GB' };
        // const argsB = { aidType: 'oda', year: 2015, sector: 'banking-and-business', groupBy: 'to_di_id'};
        const argsC = { aidType: 'oof', year: 2013, groupBy: 'bundle' };
        const argsD = { aidType: 'oda', year: 2015, groupBy: 'channel' };
        const dataC = await unbundlingAid.getUnbundlingAidData(argsC);
        const dataA = await unbundlingAid.getUnbundlingAidData(argsA);
        // const dataC = await unbundlingAid.getUnbundlingAidData(argsC);
        const dataD = await unbundlingAid.getUnbundlingAidData(argsD);
        const result = [ dataC, dataA, dataD ].map(replaceUidInList);
        expect(result).toMatchSnapshot();
    }, 100000);
    it('should get unbundling aid options from db', async () => {
        const options = await unbundlingAid.getUnbundlingOptionsIds('oda');
        expect(options).toMatchSnapshot();
    }, 10000);
    it('should create sql query args for getting data', () => {
        const argsA = {
            aidType: 'oda',
            year: 2015,
            groupBy: 'to_di_id'
        };
        const formatted = UnbundlingAid.getSqlQueryArgs(argsA);
        expect(prettyFormat(formatted)).toMatchSnapshot();
    });
    it('should return unbundling aid total', async () => {
        const totalAndYearODA = await unbundlingAid.getUnbundlingAidDataTotal({ aidType: 'oda' });
        const totalAndYearOOF = await unbundlingAid.getUnbundlingAidDataTotal({ aidType: 'oof', year: 2013 });
        expect(prettyFormat({ totalAndYearODA, totalAndYearOOF })).toMatchSnapshot();
    }, 20000);
    it('getting unbundling aid selection options', async () => {
        const dataODA = await unbundlingAid.getUnbundlingSelectionData({ aidType: 'oda' });
        const dataOOF = await unbundlingAid.getUnbundlingSelectionData({ aidType: 'oof' });
        expect(prettyFormat({ dataODA, dataOOF })).toMatchSnapshot();
    }, 100000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

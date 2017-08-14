import * as prettyFormat from 'pretty-format';
import UnbundlingAid from '.';
import db from '../../db';

describe('Unbundling aid DW module tests', () => {
    const unbundlingAid = new UnbundlingAid(db);

    it('getting unbundling aid data of various types', async () => {
        const argsA = { aidType: 'oda', year: 2015, groupBy: 'to_di_id'};
        const argsB = { aidType: 'oda', year: 2015, sector: 'banking-and-business', groupBy: 'to_di_id'};
        const argsC = { aidType: 'oda', year: 2015, groupBy: 'bundle'};
        const argsD = { aidType: 'oda', year: 2015, groupBy: 'sector'};
        const dataA = await unbundlingAid.getUnbundlingAidData(argsA);
        const dataB = await unbundlingAid.getUnbundlingAidData(argsB);
        const dataC = await unbundlingAid.getUnbundlingAidData(argsC);
        const dataD = await unbundlingAid.getUnbundlingAidData(argsD);
        expect(prettyFormat({dataA, dataB, dataC, dataD})).toMatchSnapshot();
    }, 100000);
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
        const totalAndYear = await unbundlingAid.getUnbundlingAidDataTotal({aidType: 'oda'});
        expect(prettyFormat(totalAndYear)).toMatchSnapshot();
    }, 10000);
    it('getting unbundling aid selection options', async () => {
        const data = await unbundlingAid.getUnbundlingSelectionData({aidType: 'oda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 100000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

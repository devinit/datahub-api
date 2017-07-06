import * as prettyFormat from 'pretty-format';
import UnbundlingAid from '.';
import db from '../../db';

describe('Unbundling aid DW module tests', () => {
    const unbundlingAid = new UnbundlingAid(db);

    it('getting unbundling aid data for all receipient countries', async () => {
        const argsA = {
            aidType: 'oda',
            year: 2015,
            groupBy: 'to_di_id'
        };
        const data = await unbundlingAid.getUnbundlingAidData(argsA);
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 100000);
    it('should create sql query args for getting data', () => {
        const argsA = {
            aidType: 'oda',
            year: 2015,
            groupBy: 'to_di_id'
        };
        const formatted = unbundlingAid.getSqlQueryArgs(argsA);
        expect(prettyFormat(formatted)).toMatchSnapshot();
    });
    it('getting unbundling aid selection options', async () => {
        const data = await unbundlingAid.getUnbundlingSelectionData({aidType: 'oda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 100000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const overview = countryProfile.overViewTab;

    it('should return overview tab data for uganda', async () => {
        const overViewTab = await overview.getOverViewTab({id: 'UG'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for Austria', async () => {
        const overViewTab = await overview.getOverViewTab({id: 'AT'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    it('should return overview tab data for uganda', async () => {
        const overViewTab: DH.IOverViewTab = await countryProfile.getOverViewTabRecipients({id: 'UG'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 50000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

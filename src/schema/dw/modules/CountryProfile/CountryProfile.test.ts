import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import db from '../../db';

describe('country profile DW module tests', () => {
    let overview = null;

    beforeAll(() => {
        const countryProfile = new CountryProfile(db);
        overview = countryProfile.overViewTab;
        // waiting for DB to connect, timer
        return setTimeout(() => {
            return overview;
        }, 1000);
    });

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

import * as prettyFormat from 'pretty-format';
import UnbundlingAid from '.';
import db from '../../db';

describe('Unbundling aid DW module tests', () => {
    const countryProfile = new UnbundlingAid(db);

    it.skip('unbundling aid 1', async () => {
        expect(true).toBe(true);
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

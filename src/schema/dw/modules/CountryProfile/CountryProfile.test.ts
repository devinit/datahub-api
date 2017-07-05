import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const tab = countryProfile.tabs;
    const resources = countryProfile.resources;

    it.skip('should return overview tab data for uganda', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'uganda'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for Austria', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'austria'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it('should return population tab data for Austria', async () => {
        const populationTab = await tab.getPopulationTab({id: 'austria'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it('should return population tab data for Uganda', async () => {
        const populationTab = await tab.getPopulationTab({id: 'uganda'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it('should return poverty tab data for Uganda', async () => {
        const povertyTab = await tab.getPovertyTab({id: 'uganda'});
        expect(prettyFormat(povertyTab)).toMatchSnapshot();
    }, 10000);
    it('should return international resources tab & charts data for Uganda', async () => {
        const international = await resources.getInternationalResources({id: 'uganda'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 30000);
    it('should return international resources tab & charts data for Austria', async () => {
        const international  = await resources.getInternationalResources({id: 'austria'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 30000);
    it('should return government resources tab & charts data for Uganda', async () => {
        const government = await resources.getGovernmentFinance({id: 'uganda'});
        expect(prettyFormat(government)).toMatchSnapshot();
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

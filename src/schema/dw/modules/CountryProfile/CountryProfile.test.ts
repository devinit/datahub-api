import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const tab = countryProfile.tabs;
    const resources = countryProfile.resources;

    it('should return overview tab data for uganda', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'UG'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for Austria', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'AT'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it('should return population tab data for Austria', async () => {
        const populationTab = await tab.getPopulationTab({id: 'AT'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it('should return population tab data for Uganda', async () => {
        const populationTab = await tab.getPopulationTab({id: 'UG'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it('should return poverty tab data for Uganda', async () => {
        const povertyTab = await tab.getPovertyTab({id: 'UG'});
        expect(prettyFormat(povertyTab)).toMatchSnapshot();
    }, 10000);
    it.skip('should return international resources tab & charts data for Uganda', async () => {
        const international = await resources.getInternationalResources({id: 'UG'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 10000);
    it.skip('should return international resources tab & charts data for Austria', async () => {
        const international  = await resources.getInternationalResources({id: 'AT'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 10000);
    it.skip('should return government resources tab & charts data for Uganda', async () => {
        const government = await resources.getInternationalResources({id: 'UG'});
        expect(prettyFormat(government)).toMatchSnapshot();
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

import * as prettyFormat from 'pretty-format';
import CountryProfile from '.';
import * as R from 'ramda';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const tab = countryProfile.tabs;
    const resources = countryProfile.resources;
    it.skip('should return flow types and sub selections for uganda', async () => {
        const flows = await resources.getFlows('uganda');
        expect(prettyFormat(flows)).toMatchSnapshot();
    }, 10000);
    it.skip('should return overview tab data for uganda', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'uganda'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it.skip('should return overview tab data for Austria', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'austria'});
        expect(prettyFormat(overViewTab)).toMatchSnapshot();
    }, 10000);
    it.skip('should return population tab data for Austria', async () => {
        const populationTab = await tab.getPopulationTab({id: 'austria'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it.skip('should return population tab data for Uganda', async () => {
        const populationTab = await tab.getPopulationTab({id: 'uganda'});
        expect(prettyFormat(populationTab)).toMatchSnapshot();
    }, 10000);
    it.skip('should return poverty tab data for Uganda', async () => {
        const povertyTab = await tab.getPovertyTab({id: 'uganda'});
        expect(prettyFormat(povertyTab)).toMatchSnapshot();
    }, 10000);
    it('should return international resources tab & charts data for Mali', async () => {
        const international = await resources.getInternationalResources({id: 'mali'});
        const debt = international.resourcesOverTime
            .filter(obj => obj.flow_name === 'long-debt-net-official-in')
            .map(obj => ({year: obj.year, flow_name: obj.flow_name}));
        const groupedDebt = R.groupBy(R.prop('year'), debt);
        expect(prettyFormat({'long-debt': groupedDebt})).toMatchSnapshot();
        expect(prettyFormat({overtime: international.resourcesOverTime})).toMatchSnapshot();
    }, 30000);
    it.skip('should return international resources tab & charts data for Austria', async () => {
        const international  = await resources.getInternationalResources({id: 'austria'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 30000);
    it.skip('should return government finance data for Uganda', async () => {
        const government = await resources.getGovernmentFinance({id: 'uganda'});
        expect(prettyFormat(government)).toMatchSnapshot();
    }, 10000);
    it.skip('should return single resource FDI data for use in international resources chart', async () => {
        const singleResourceFDIout = await resources.getSingleResource(
            { resourceId: 'fdi-out', countryId: 'UG', groupById: 'from_di_id'});
        expect(prettyFormat(singleResourceFDIout)).toMatchSnapshot();
    }, 10000);
    it.skip('should return single resource ODA data for use in international resources chart', async () => {
        const singleResourceODA = await resources.getSingleResource(
            { resourceId: 'oda-in', countryId: 'UG', groupById: 'sector'});
        expect(prettyFormat(singleResourceODA)).toMatchSnapshot();
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

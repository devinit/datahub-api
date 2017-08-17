import * as prettyFormat from 'pretty-format';
// import {uidPatchForTabData} from '../utils/test-utils';
import CountryProfile from '.';
import * as R from 'ramda';
import db from '../../db';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const tab = countryProfile.tabs;
    const resources = countryProfile.resources;
    it('should return flow types and sub selections for both recipient & donors', async () => {
        const recipient = await resources.getFlows('recipient');
        const donor = await resources.getFlows('donor');
        expect(prettyFormat({recipient, donor})).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for uganda', async () => {
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
        const internationalA = await resources.getInternationalResources({id: 'uganda'});
        const internationalB = await resources.getInternationalResources({id: 'somalia'});
        expect(prettyFormat({ uganda: internationalA, somalia: internationalB})).toMatchSnapshot();
    }, 30000);
    it('should return international resources tab & charts data for Austria', async () => {
        const international  = await resources.getInternationalResources({id: 'austria'});
        expect(prettyFormat(international)).toMatchSnapshot();
    }, 30000);
    it('should return government finance data for Uganda && somalia', async () => {
        const governmentA = await resources.getGovernmentFinance({id: 'uganda'});
        const governmentB = await resources.getGovernmentFinance({id: 'somalia'});
        expect(prettyFormat({somalia: governmentB, uganda: governmentA})).toMatchSnapshot();
    }, 10000);
    it('should return single resource FDI data for use in international resources chart', async () => {
        const singleResourceFDIout = await resources.getSingleResource(
            { resourceId: 'fdi-out', countryId: 'UG', groupById: 'from_di_id'});
        expect(prettyFormat(singleResourceFDIout)).toMatchSnapshot();
    }, 10000);
    it('should return single resource ODA data for use in international resources chart', async () => {
        const singleResourceODA = await resources.getSingleResource(
            { resourceId: 'oda-in', countryId: 'UG', groupById: 'sector'});
        expect(prettyFormat(singleResourceODA)).toMatchSnapshot();
    }, 10000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

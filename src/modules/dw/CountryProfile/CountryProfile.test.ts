import * as prettyFormat from 'pretty-format';
// import {uidPatchForTabData} from '../utils/test-utils';
import {getFlows} from '../../../cms/modules/countryProfile';
import CountryProfile from '.';
import * as R from 'ramda';
import Resources from './Resources';
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
    it('should return a flows positions', async () => {
        const flows = await getFlows();
        const position =  Resources.getFlowPositions(flows)(flows[1]);
        expect(prettyFormat({raw: flows[1], position})).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for uganda && turkey', async () => {
        const uganda = await tab.getOverViewTab({id: 'uganda'});
        const turkey = await tab.getOverViewTab({id: 'turkey'});
        expect(prettyFormat({uganda, turkey})).toMatchSnapshot();
    }, 10000);
    it('should return overview tab data for Austria', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'romania'});
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
        const internationalA = await resources.getInternationalResources({id: 'andorra'});
        // const internationalB = await resources.getInternationalResources({id: 'china'});
        expect(prettyFormat(internationalA)).toMatchSnapshot();
    }, 30000);
    it('should return international resources tab & charts data for Austria & turkey', async () => {
        const austria  = await resources.getInternationalResources({id: 'austria'});
        const turkey  = await resources.getInternationalResources({id: 'turkey'});
        expect(prettyFormat({austria, turkey})).toMatchSnapshot();
    }, 30000);
    it('should return spending allocation for palestine', async () => {
        const palestine = await resources.getSpendingAllocation('palestine');
        const uganda = await resources.getSpendingAllocation('uganda');
        expect(prettyFormat({palestine, uganda})).toMatchSnapshot();
    }, 10000);
    it('should return government finance data for Uganda && somalia && Turkey', async () => {
        const gvtUg = await resources.getGovernmentFinance({id: 'uganda'});
        const gvtSamoa = await resources.getGovernmentFinance({id: 'samoa'});
        expect(prettyFormat({gvtSamoa, gvtUg})).toMatchSnapshot();
    }, 10000);
    it('should return single resources data for use in international resources chart', async () => {
        const FDIOut = await resources.getSingleResource(
            { resourceId: 'fdi-out', countryId: 'UG', groupById: 'from_di_id'});
        const shortDebtOut = await resources.getSingleResource(
            { resourceId: 'short-debt-interest-out', countryId: 'UG', groupById: 'flow_type'});
        const ODAOut = await resources.getSingleResource(
            { resourceId: 'oda-out', countryId: 'AT', groupById: 'channel'});
        const ODAIn = await resources.getSingleResource(
            { resourceId: 'oda-in', countryId: 'UG', groupById: 'from_di_id'});
        const LDIn = await resources.getSingleResource(
            { resourceId: 'long-debt-net-official-in', countryId: 'UG', groupById: 'flow_type'});
        const LDCommercialIn = await resources.getSingleResource(
                { resourceId: 'long-debt-disbursement-in', countryId: 'UG', groupById: 'flow_type'});
        expect(prettyFormat({ shortDebtOut, FDIOut, ODAOut, LDIn, LDCommercialIn, ODAIn})).toMatchSnapshot();
    }, 50000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

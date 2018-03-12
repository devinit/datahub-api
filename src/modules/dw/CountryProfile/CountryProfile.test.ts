import * as prettyFormat from 'pretty-format';
import {getFlows} from '../../refs/countryProfile';
import CountryProfile from '.';
import Resources from './Resources';
import db from '@devinit/graphql-next/lib/db';
import {prettyDataObjs, uidPatchForObjs } from '@devinit/prelude';

describe('country profile DW module tests', () => {
    const countryProfile = new CountryProfile(db);
    const tab = countryProfile.tabs;
    const resources = countryProfile.resources;
    it('should return flow types and sub selections for both recipient & donors', async () => {
        const recipient = await resources.getFlows('recipient');
        const donor = await resources.getFlows('donor');
        expect(prettyFormat({recipient, donor})).toMatchSnapshot();
    }, 50000);
    it('should return a flows positions', async () => {
        const flows = await getFlows();
        const position =  Resources.getFlowPositions(flows)(flows[1]);
        expect(prettyFormat({raw: flows[1], position})).toMatchSnapshot();
    }, 50000);
    it('should return overview tab data for uganda && turkey', async () => {
        const uganda = await tab.getOverViewTab({id: 'uganda'});
        const turkey = await tab.getOverViewTab({id: 'turkey'});
        const result = {uganda: uidPatchForObjs(uganda), turkey: uidPatchForObjs(turkey)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
    it('should return overview tab data for Austria', async () => {
        const overViewTab = await tab.getOverViewTab({id: 'romania'});
        expect(prettyDataObjs(overViewTab)).toMatchSnapshot();
    }, 50000);
    it('should return population tab data for Austria', async () => {
        const populationTab = await tab.getPopulationTab({id: 'austria'});
        expect(prettyDataObjs(populationTab)).toMatchSnapshot();
    }, 50000);
    it('should return population tab data for Uganda', async () => {
        const populationTab = await tab.getPopulationTab({id: 'uganda'});
        expect(prettyDataObjs(populationTab)).toMatchSnapshot();
    }, 50000);
    it('should return poverty tab data for Uganda', async () => {
        const povertyTab = await tab.getPovertyTab({id: 'uganda'});
        expect(prettyDataObjs(povertyTab)).toMatchSnapshot();
    }, 50000);
    it('should return international resources tab & charts data for Uganda', async () => {
        const internationalA = await resources.getInternationalResources({id: 'andorra'});
        // const internationalB = await resources.getInternationalResources({id: 'china'});
        expect(prettyDataObjs(internationalA)).toMatchSnapshot();
    }, 30000);
    it('should return international resources tab & charts data for Austria & turkey', async () => {
        const austria  = await resources.getInternationalResources({id: 'austria'});
        const turkey  = await resources.getInternationalResources({id: 'turkey'});
        const result = {austria: uidPatchForObjs(austria), turkey: uidPatchForObjs(turkey)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 30000);
    it('should return spending allocation for palestine', async () => {
        const palestine = await resources.getSpendingAllocation('palestine');
        const uganda = await resources.getSpendingAllocation('uganda');
        const result = {palestine: uidPatchForObjs(palestine), uganda: uidPatchForObjs(uganda)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
    it('should return government finance data for Uganda && somalia && Turkey', async () => {
        const gvtUg = await resources.getGovernmentFinance({id: 'uganda'});
        const gvtSamoa = await resources.getGovernmentFinance({id: 'samoa'});
        const result = {gvtUg: uidPatchForObjs(gvtUg), gvtSamoa: uidPatchForObjs(gvtSamoa)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
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
        const result = {FDIOut: uidPatchForObjs(FDIOut), shortDebtOut: uidPatchForObjs(shortDebtOut),
            ODAOut: uidPatchForObjs(ODAOut), ODAIn: uidPatchForObjs(ODAIn),
            LDIn: uidPatchForObjs(LDIn), LDCommercialIn: uidPatchForObjs(LDCommercialIn)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

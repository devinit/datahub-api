import * as prettyFormat from 'pretty-format';
import SpotLight from '.';
import db from '@devinit/graphql-next/lib/db';
import {prettyDataObjs, uidPatchForObjs } from '@devinit/prelude';

describe('spotlight on uganda tests', () => {
    const spotLight = new SpotLight(db);

    it('should return overview tab data for wakiso and nairobi district ', async () => {
        const wakiso = await spotLight.getOverViewTabRegional({id: 'wakiso', country: 'uganda'});
        const nairobi = await spotLight.getOverViewTabRegional({id: 'nairobi', country: 'kenya'});
        const result = {wakiso: uidPatchForObjs(wakiso), nairobi: uidPatchForObjs(nairobi)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
    it('should return PovertyTab tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getPovertyTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getPovertyTabRegional({id: 'nairobi'});
        const result = {wakiso: uidPatchForObjs(wakiso), nairobi: uidPatchForObjs(nairobi)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 10000);
    it('should return population tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getPopulationTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getPopulationTabRegional({id: 'nairobi'});
        const result = {wakiso: uidPatchForObjs(wakiso), nairobi: uidPatchForObjs(nairobi)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);
    it('should return education tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getEducationTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getEducationTabRegional({id: 'nairobi'});
        const result = {wakiso: uidPatchForObjs(wakiso), nairobi: uidPatchForObjs(nairobi)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 10000);
    it('should return health tab data for wakiso and nairobi district', async () => {
        // const wakiso = await spotLight.uganda.getHealthTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getHealthTabRegional({id: 'nairobi'});
        expect(prettyDataObjs({nairobi})).toMatchSnapshot();
    }, 10000);
    it('should return finance data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getLocalGovernmentFinance({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getLocalGovernmentFinance({id: 'nairobi'});
        const result = {wakiso: uidPatchForObjs(wakiso), nairobi: uidPatchForObjs(nairobi)};
        expect(prettyFormat(result)).toMatchSnapshot();
    }, 50000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

import * as prettyFormat from 'pretty-format';
import SpotLight from '.';
import db from '../../db';

describe('spotlight on uganda tests', () => {
    const spotLight = new SpotLight(db);

    it.skip('should return overview tab data for wakiso and nairobi district ', async () => {
        const wakiso = await spotLight.getOverViewTabRegional({id: 'wakiso', country: 'uganda'});
        const nairobi = await spotLight.getOverViewTabRegional({id: 'nairobi', country: 'kenya'});
        expect(prettyFormat({nairobi, wakiso})).toMatchSnapshot();
    }, 50000);
    it.skip('should return PovertyTab tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getPovertyTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getPovertyTabRegional({id: 'nairobi'});
        expect(prettyFormat({wakiso, nairobi})).toMatchSnapshot();
    }, 10000);
    it.skip('should return population tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getPopulationTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getPopulationTabRegional({id: 'nairobi'});
        expect(prettyFormat({wakiso, nairobi})).toMatchSnapshot();
    }, 50000);
    it.skip('should return education tab data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getEducationTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getEducationTabRegional({id: 'nairobi'});
        expect(prettyFormat({nairobi, wakiso})).toMatchSnapshot();
    }, 10000);
    it.skip('should return health tab data for wakiso and nairobi district', async () => {
        // const wakiso = await spotLight.uganda.getHealthTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getHealthTabRegional({id: 'nairobi'});
        expect(prettyFormat({nairobi})).toMatchSnapshot();
    }, 10000);
    it('should return finance data for wakiso and nairobi district', async () => {
        const wakiso = await spotLight.uganda.getLocalGovernmentFinance({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getLocalGovernmentFinance({id: 'nairobi'});
        expect(prettyFormat({nairobi, wakiso})).toMatchSnapshot();
    }, 50000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

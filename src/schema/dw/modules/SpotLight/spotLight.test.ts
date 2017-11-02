import * as prettyFormat from 'pretty-format';
import SpotLight from '.';
import db from '../../db';

describe('spotlight on uganda tests', () => {
    const spotLight = new SpotLight(db);

    it('should return overview tab data for wakiso district and ', async () => {
        const wakiso = await spotLight.getOverViewTabRegional({id: 'wakiso', country: 'uganda'});
        const nairobi = await spotLight.getOverViewTabRegional({id: 'nairobi', country: 'kenya'});
        expect(prettyFormat({nairobi, wakiso})).toMatchSnapshot();
    }, 50000);
    it('should return PovertyTab tab data for wakiso district', async () => {
        const wakiso = await spotLight.uganda.getPovertyTabRegional({id: 'wakiso'});
        const nairobi = await spotLight.kenya.getPovertyTabRegional({id: 'nairobi'});
        expect(prettyFormat({wakiso, nairobi})).toMatchSnapshot();
    }, 10000);
    it.skip('should return population tab data for wakiso district', async () => {
        const data = await spotLight.getPopulationTabRegional({id: 'wakiso', country: 'uganda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 10000);
    it.skip('should return education tab data for wakiso district', async () => {
        const data = await spotLight.getEducationTabRegional({id: 'wakiso', country: 'uganda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 10000);
    it.skip('should return health tab data for wakiso district', async () => {
        const data = await spotLight.getHealthTabRegional({id: 'wakiso', country: 'uganda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 10000);
    it.skip('should return finance data for wakiso district', async () => {
        const data = await spotLight.getLocalGovernmentFinance({id: 'wakiso', country: 'uganda'});
        expect(prettyFormat(data)).toMatchSnapshot();
    }, 50000);

    afterAll(() => {
       db.$config.pgp.end();
    });
});

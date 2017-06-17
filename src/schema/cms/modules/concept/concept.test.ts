import 'jest';
import {getConceptData} from '.';

describe('Github concept data tests', () => {
    it('should get data from concept.csv of a module on github', async () => {
        const conceptData: DH.IConcept[] = await getConceptData('global-picture');
        expect(conceptData.length).toBeGreaterThan(2);
        expect(conceptData[0].id).toBe('avg_income_of_extreme_poor');
    }, 10000);
});

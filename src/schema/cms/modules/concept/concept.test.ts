import 'jest';
import {getConcepts, IConcept, getConceptAsync} from '.';
import * as prettyFormat from 'pretty-format';

describe('Github concept data tests', () => {
    it('should get data from concept.csv of a module on github', async () => {
        const conceptsData: IConcept[] = await getConcepts('global-picture');
        expect(conceptsData.length).toBeGreaterThan(2);
    }, 50000);
    it('should get data from concept.csv of an Id in a module Async', async () => {
        const concept: IConcept = await getConceptAsync('country-profile', 'data_series.domestic');
        expect(prettyFormat(concept)).toMatchSnapshot();
    }, 50000);
});

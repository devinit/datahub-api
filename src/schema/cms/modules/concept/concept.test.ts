import 'jest';
import {getConcepts, IConcept, getConceptAsync, getConcept} from '.';
import * as prettyFormat from 'pretty-format';

describe('Github concept data tests', () => {
    it('should get data from concept.csv of a module on github', async () => {
        const conceptsData: IConcept[] = await getConcepts('global-picture');
        const concept: IConcept = getConcept('avg_income_of_extreme_poor', conceptsData);
        expect(conceptsData.length).toBeGreaterThan(2);
        expect(prettyFormat(concept)).toMatchSnapshot();
    }, 10000);
    it('should get data from concept.csv of an Id in a module Async', async () => {
        const concept: IConcept = await getConceptAsync('country-profile', 'domestic');
        expect(prettyFormat(concept)).toMatchSnapshot();
    }, 10000);
});

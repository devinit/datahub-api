import {makeSqlAggregateQuery, isDonor} from '.';
import * as prettyFormat from 'pretty-format';
import {approximate, toId, getTotal, normalizeKeyName} from '@devinit/prelude';

const dataA = [
        {di_id: 'AL', value: 3000, year: 2000},
        {di_id: 'UK', value: 3000, year: 2000}
        ];
// const dataB = [
//     {id: 'AL', value: 3000, year: 2000},
//     {id: 'UK', value: 3000, year: 2000}
//     ];
// const entities = [
//     {id: 'UK', name: 'England', type: 'donor', slug: 'uk', donor_recipient_type: DONOR},
//     {id: 'UG', name: 'Uganda', type: 'recipient', slug: 'uganda', donor_recipien_type: RECIPIENT}
//     ];
describe('Utility functions test', () => {
    it('should remove di_id field in objects and replace with id', () => {
        const formatted = toId(dataA[0]);
        expect(formatted.id).toBe('AL');
    });
    it('should get total of the value field in an array', () => {
        expect(getTotal(dataA)).toBe(6000);
    });
    it('should create human friendly numbers i.e 1.5k for 1500', () => {
        // const formattedA = [150, 1500, 15000, 200000000].map(val => approximate(val, 0));
        const formattedB = [150, 1500, 15000, 200000000].map(val => approximate(val, 1, true));
        expect(prettyFormat({formattedB})).toMatchSnapshot();
    });
    it('should create an aggregate sql query for multiple years', () => {
        const argsB = {
            from_di_id: 'afdb',
            to_di_id: 'UG',
            years: [2013, 2015]
        };
        const queryB = makeSqlAggregateQuery(argsB, 'bundle', 'fact.oda_2015');
        expect(prettyFormat(queryB)).toMatchSnapshot();
    });
    it('should create an aggregate sql query for a single year i.e unbundling aid', () => {
        const argsB = {
            from_di_id: 'afdb',
            to_di_id: 'UG',
            year: 2013
        };
        const argsA = {
            year: 2015,
            sector: 'banking-and-business',
        };
        const queryB = makeSqlAggregateQuery(argsB, 'bundle', 'fact.oda_2015');
        const queryA = makeSqlAggregateQuery(argsA, 'to_di_id', 'fact.oda_2015');
        const querys = {queryA, queryB};
        expect(prettyFormat(querys)).toMatchSnapshot();
    });
    it('should normalize colum name ie remove _ where necessry', () => {
        const ageBand = normalizeKeyName('value_0_14');
        expect(ageBand).toBe('0-14');
    });
    it('should return whether country is donor or not', async () => {
        const isDonorCountryA = await isDonor('uganda');
        const isDonorCountryB = await isDonor('austria');
        expect(isDonorCountryA).toBe(false);
        expect(isDonorCountryB).toBe(true);
    }, 10000);
});

import {toId, getTotal, addCountryName, DONOR, RECIPIENT, makeSqlAggregateQuery} from '.';
import * as prettyFormat from 'pretty-format';

const dataA = [
        {di_id: 'AL', value: 3000, year: 2000},
        {di_id: 'UK', value: 3000, year: 2000}
        ];
const dataB = [
    {id: 'AL', value: 3000, year: 2000},
    {id: 'UK', value: 3000, year: 2000}
    ];
const entities = [
    {id: 'UK', name: 'England', type: 'donor', slug: 'uk', donorRecipientType: DONOR},
    {id: 'UG', name: 'Uganda', type: 'recipient', slug: 'uganda', donorRecipientType: RECIPIENT}
    ];
describe('Utility functions test', () => {
    it('should remove di_id field in objects and replace with id', () => {
        const formatted = toId(dataA[0]);
        expect(formatted.id).toBe('AL');
    });
    it('should get total of the value field in an array', () => {
        expect(getTotal(dataA)).toBe(6000);
    });
    it('should return countryname using entities data', () => {
        const entity = addCountryName(dataB[1], entities);
        expect(entity.countryName).toBe('England');
    });
    it('should create an aggregate sql query for a single year', () => {
        const argsA = {
            from_di_id: 'afdb',
            to_di_id: 'UG',
            year: 2013
        };
        const queryA = makeSqlAggregateQuery(argsA, 'sector', 'fact.oda');
        expect(prettyFormat(queryA)).toMatchSnapshot();
    });
    it('should create an aggregate sql query for multiple years', () => {
    const argsB = {
        from_di_id: 'afdb',
        to_di_id: 'UG',
        years: [2013, 2015]
    };
    const queryB = makeSqlAggregateQuery(argsB, 'bundle', 'fact.oda');
    expect(prettyFormat(queryB)).toMatchSnapshot();
    });
});

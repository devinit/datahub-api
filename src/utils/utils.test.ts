import {toId, getTotal, addCountryName} from '.';

const dataA = [
        {di_id: 'AL', value: 3000, year: 2000},
        {di_id: 'UK', value: 3000, year: 2000}
        ];
const dataB = [
    {id: 'AL', value: 3000, year: 2000},
    {id: 'UK', value: 3000, year: 2000}
    ];
const entities = [
    {id: 'UK', name: 'England', type: 'donor'},
    {id: 'UG', name: 'Uganda', type: 'recipient'}
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
});

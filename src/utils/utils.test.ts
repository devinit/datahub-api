import {toId, getTotal} from '.';

describe('Utility functions test', () => {
    const data = [
            {di_id: 'AL', value: 3000, year: 2000},
            {di_id: 'AB', value: 3000, year: 2000}
            ];

    it('should remove di_id field in objects and replace with id', () => {
        const formatted = toId(data);
        expect(formatted[0].id).toBe('AL');
    });
    it('should get total of the value field in an array', () => {
        expect(getTotal(data)).toBe(6000);
    });
});

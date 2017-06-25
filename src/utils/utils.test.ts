import {formatNumbers} from '.';

describe('Utility functions test', () => {
    it('should format numbers into readeable string eg 1m or 1bn', () => {
        expect(formatNumbers(10000)).toBe('10k');
        expect(formatNumbers(10000000)).toBe('10m');
        expect(formatNumbers(10000000000)).toBe('10bn');
    });
});

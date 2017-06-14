import Maps from '.';

describe('Maps module tests', () => {

    it('should return merged typedefs', async () => {
        const dacCountries = ['Spain', 'England'];
        const data = [
            {value: 2000, id: 'sp', countryName: 'Spain'},
            {value: 2000, id: 'uk', countryName: 'Engaland'},
            {value: 2000, id: 'pl', countryName: 'Poland'}
            ];
        const onlyDacCountries = Maps.DACOnlyData(dacCountries, data);
        expect(onlyDacCountries.length).toBe(2);
    });
});

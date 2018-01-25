import Maps from '.';
import * as prettyFormat from 'pretty-format';
import db from '@devinit/graphql-next/lib/db';

describe('Maps module tests', () => {
    const maps = new Maps(db);

    it('should return only DAC countries from the data', async () => {
        const dacCountries = ['Spain', 'England'];
        const data = [
            {value: 2000, id: 'sp', name: 'Spain', year: 2000},
            {value: 2000, id: 'uk', name: 'England', year: 2000},
            {value: 2000, id: 'pl', name: 'Poland', year: 2000},
            ];
        const onlyDacCountries = Maps.DACOnlyData(dacCountries, data);
        expect(prettyFormat({onlyDacCountries})).toMatchSnapshot();
        expect(onlyDacCountries.length).toBe(2);
    }, 10000);
    it('should know if an indicator is for a country spotlight or for global picture', async () => {
        const country = await Maps.getCountry('spotlight_on_uganda.uganda_poverty_headcount');
        const global = await Maps.getCountry('data_series.poorest_20_percent');
        expect(country).toBe('uganda');
        expect(global).toBe('global');
    }, 10000);
    it('should return spotlight on uganda indicator data', async () => {
        const linearColored =
            await maps.getMapData('spotlight_on_uganda_2017.uganda_total_pop');
        expect(prettyFormat({linearColored})).toMatchSnapshot();
    }, 20000);
    it('should return spotlight on kenya indicator data', async () => {
        const linearColored =
            await maps.getMapData('spotlight_on_kenya_2017.kenya_disability');
        expect(prettyFormat({linearColored})).toMatchSnapshot();
    }, 20000);
    it('should return global picture indicator for map styled data  ', async () => {
        const surveryP20 = await maps.getMapData('survey_p20');
        expect(prettyFormat({surveryP20})).toMatchSnapshot();
    }, 20000);
    it('should return global picture indicators data ', async () => {
        // const linearColored = await maps.getMapData('data_series.in_ha');
        const categoricalLinear = await maps.getMapData( 'data_series.fragile_states');
        // const dataRevolution = await maps.getMapData( 'data_series.latest_census');
        // const largestIntlFinance = await maps.getMapData( 'data_series.largest_intl_flow');
        // const governmentFinance = await maps.getMapData( 'data_series.non_grant_revenue_ppp_pc');
        // const dacCountries = await maps.getMapData( 'fact.oda_percent_gni');
        expect(prettyFormat({categoricalLinear })).toMatchSnapshot();
    }, 20000);
    it('should return categorical value mappings for indicators', async () => {
        const fragileSates = await Maps.getCategoricalMapping('data_series.fragile_states');
        const dataRevolution = await Maps.getCategoricalMapping('data_series.agricultural_census', 'data-revolution');
        expect(prettyFormat({fragileSates, dataRevolution})).toMatchSnapshot();
    }, 10000);
    it('should return color values from a scale', async () => {
        const ramp = {high: '#e84439', low: '#fbd7cb'};
        const scaleA = Maps.colorScale({rangeStr: '1, 5, 10, 50', ramp});
        const scaleB = Maps.colorScale({rangeStr: '80,60,40,20', ramp, isHighBetter: true});
        const results = {
            rangeB: scaleB.range(),
            domainB:  scaleB.domain(),
            rangeA: scaleA.range(),
            domainA:  scaleA.domain()
        };
        expect(prettyFormat(results)).toMatchSnapshot();
    });
    it('should create legend for map data', async () => {
        const rampA = {high: '#e84439', low: '#fbd7cb'};
        const rampB = {high: '#0c457b', low: '#bcd4f0'};
        const rangeA = '1, 5, 10, 20';
        const rangeB = '200,500,1000,1500,2000,10000';
        const rangeC = '80,60,40,20';
        const scaleA = Maps.colorScale({rangeStr: rangeA, ramp: rampA});
        const scaleB = Maps.colorScale({rangeStr: rangeB, ramp: rampB, isHighBetter: true});
        const scaleC = Maps.colorScale({rangeStr: rangeC, ramp: rampA});
        const legendA = Maps.createLinearLegend('%', rangeA, scaleA);
        const legendB = Maps.createLinearLegend('', rangeB, scaleB);
        const legendC = Maps.createLinearLegend('%', rangeC, scaleC);
        expect(prettyFormat({legendB, legendC, legendA})).toMatchSnapshot();
    });
    it('should create color ramp', async () => {
        const ramp = {high: '#e84439', low: '#f8c1b2'};
        const colorRamp = await Maps.getColorRamp('red');
        expect(prettyFormat(colorRamp)).toMatchSnapshot();
    }, 20000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});

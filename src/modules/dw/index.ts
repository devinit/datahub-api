
import BubbleChart from './BubbleChart';
import Maps from './Maps';
import SpotLight from './SpotLight';
import UnbundlingAid from './UnbundlingAid';
import CountryProfile from './CountryProfile';

export interface IDW {
    bubbleChart: BubbleChart;
    maps: Maps;
    countryProfiles: CountryProfile;
    unbundlingAid: UnbundlingAid;
    spotLight: SpotLight;
}

export default [
    {bubbleChart: (db) => new BubbleChart(db)},
    {maps : (db) => new Maps(db)},
    {countryProfile: (db) => new CountryProfile(db)},
    {unbundlingAid: (db) => new UnbundlingAid(db)},
    {spotLight: (db) => new SpotLight(db)}
];

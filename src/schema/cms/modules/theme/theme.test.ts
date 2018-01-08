import 'jest';
import { getGlobalPictureThemes, getSpotlightThemes} from '.';
import * as prettyFormat from 'pretty-format';

describe('Themes data tests', () => {
    it('should return global picture themes', async () => {
        const themes = await getGlobalPictureThemes();
        expect(prettyFormat(themes)).toMatchSnapshot();
    }, 100000);
    it('should return spotlight on uganda themes', async () => {
        const themesUg = await getSpotlightThemes('uganda');
        const themesKe = await getSpotlightThemes('kenya');
        expect(prettyFormat({themesUg, themesKe})).toMatchSnapshot();
    }, 30000);
});

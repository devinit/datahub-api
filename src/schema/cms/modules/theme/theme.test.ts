import 'jest';
import { getGlobalPictureThemes, getSpotlightThemes} from '.';
import * as prettyFormat from 'pretty-format';

describe('Themes data tests', () => {
    it.skip('should return global picture themes', async () => {
        const themes = await getGlobalPictureThemes();
        expect(prettyFormat(themes)).toMatchSnapshot();
    }, 100000);
    it('should return spotlight on uganda themes', async () => {
        const themes = await getSpotlightThemes('uganda');
        expect(prettyFormat(themes)).toMatchSnapshot();
    }, 30000);
});

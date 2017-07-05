import {getGlobalPictureThemes, getTheme} from '.';
import * as prettyFormat from 'pretty-format';

describe('Site global Picture narratives and refrence module', () => {
    it('should return all themes', async () => {
        const themes = await getGlobalPictureThemes();
        const theme = getTheme('poverty', themes);
        expect(themes[0].id).toBeDefined();
        expect(themes.length).toBeGreaterThan(4);
        expect(prettyFormat(theme)).toMatchSnapshot();
    }, 20000);
});

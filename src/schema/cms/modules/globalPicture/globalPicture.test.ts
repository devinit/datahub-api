import {getThemes, getTheme} from '.';

describe('Site global Picture narratives and refrence module', () => {
    it('should return all themes', async () => {
        const themes = await getThemes();
        const theme = getTheme('poorest20pct', themes);
        expect(themes[0].id).toBeDefined();
        expect(themes.length).toBeGreaterThan(4);
        expect(theme.default).toBe('poorest-20-percent');
    });
});

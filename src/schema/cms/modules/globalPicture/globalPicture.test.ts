import {getThemes, getTheme} from '.';

describe('Site global Picture narratives and refrence module', () => {
    it('should return all themes', async () => {
        const themes = await getThemes();
        expect(themes[0].id).toBeDefined();
        expect(themes.length).toBeGreaterThan(4);
    });
    it('should return a theme', async () => {
        const themes = await getTheme('poorest20pct');
        expect(themes.default).toBe('poorest-20-percent');
    });
});

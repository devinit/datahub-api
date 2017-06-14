import {getThemes, getTheme} from '.';

describe('Site global Picture narratives and refrence module', () => {
    it('should return all themes', async () => {
        const entities = await getThemes();
        expect(entities[0].id).toBeDefined();
        expect(entities.length).toBeGreaterThan(4);
    });
    it('should return a theme', async () => {
        const entities = await getTheme('poorest20pct');
        expect(entities.default).toBe('poorest-20-percent');
    });
});

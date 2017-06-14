import {getEntities, getEntity} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        expect(entities[0].id).toBeDefined();
        expect(entities.length).toBeGreaterThan(30);
    });
    it('should return an entity', async () => {
        const entities = await getEntity('AR');
        expect(entities.name).toBe('Argentina');
    });
});

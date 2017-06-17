import {getEntities, getEntityById, getEntityBySlug} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        expect(entities[0].id).toBeDefined();
        const entityA = getEntityById('AR', entities);
        const entityB = getEntityBySlug('benin', entities);
        expect(entities.length).toBeGreaterThan(30);
        expect(entityA.name).toBe('Argentina');
        expect(entityB.name).toBe('Benin');
    }, 10000);
});

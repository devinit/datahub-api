import {getEntities, getEntityById} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        expect(entities[0].id).toBeDefined();
        const entityA = getEntityById('AR', entities);
        expect(entities.length).toBeGreaterThan(30);
        expect(entityA.name).toBe('Argentina');
    }, 10000);
});

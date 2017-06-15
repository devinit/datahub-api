import {getEntities, getEntity} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        expect(entities[0].id).toBeDefined();
        const entity = await getEntity('AR', entities);
        expect(entities.length).toBeGreaterThan(30);
        expect(entity.name).toBe('Argentina');
    });
});

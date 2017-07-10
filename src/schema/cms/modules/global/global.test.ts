import * as prettyFormat from 'pretty-format';
import {getEntities, getEntityById} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        const entity = getEntityById('AF', entities);
        expect(entity.name).toBe('Afghanistan');
        expect(prettyFormat(entity)).toMatchSnapshot();
    }, 10000);
});

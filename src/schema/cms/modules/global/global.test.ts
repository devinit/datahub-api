import * as prettyFormat from 'pretty-format';
import {getEntities, getEntityByIdGeneric, getColors} from '.';

describe('Site Global narratives and refrence module', () => {
    it('should return all entities', async () => {
        const entities = await getEntities();
        const entity = getEntityByIdGeneric('AF', entities);
        expect(entity.name).toBe('Afghanistan');
        expect(prettyFormat(entity)).toMatchSnapshot();
    }, 10000);
    it('should return colors', async () => {
        const colors = await getColors();
        expect(prettyFormat(colors)).toMatchSnapshot();
    }, 10000);
});

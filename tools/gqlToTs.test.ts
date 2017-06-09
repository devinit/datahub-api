import 'jest';
import { GraphQLSchema, buildSchema } from 'graphql';
import { main, IgqlTsOpts, getTypeDefs, normalizeWhitespace} from './gqlToTs';
import expectedSimple from './tests/expected-simple';
import * as prettyFormat from 'pretty-format';

const removeAllSpaces = (str) => str.replace(/\s++/g, '');

describe('gql Types to Typescript types', () => {

    it('should return merged typedefs', async () => {
        const typeDefs = await getTypeDefs('**/simple-*.gql');
        expect(prettyFormat(typeDefs)).toMatchSnapshot();
    });
    it('merged types should be convertable to a GraphQLSchema', async () => {
        const typeDefs = await getTypeDefs('**/simple-*.gql');
        expect(buildSchema(typeDefs)).toBeInstanceOf(GraphQLSchema);
    });
    it.skip('should work with types with comments', async () => {
        // currently doesnt work with comments in the query type sections of schema
        const typeDefsWithComments =  await getTypeDefs('**/complex-*.gql');
        expect(buildSchema(typeDefsWithComments)).toBeInstanceOf(GraphQLSchema);
        expect(prettyFormat(typeDefsWithComments)).toMatchSnapshot();
    });
    it ('End to End test: should create typescript types from graphql files', async () => {
        const tsTypesNameSpace = await main({globPattern: '**/simple-*.gql'});
        expect(prettyFormat(tsTypesNameSpace)).toMatchSnapshot();
    });
});

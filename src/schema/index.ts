
import { GraphQLSchema} from 'graphql';
import { mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import * as fs from 'fs';
import {getTypeDefs} from '../../tools/gqlToTs';

const resolverFiles = (require as any).context('./example', true, /resolver\.ts/);
const typeFiles = (require as any).context('./', true, /\.gql/);

const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];

const createSchema = async (): Promise<GraphQLSchema> => {
    const typeDefs = await getTypeDefs('**/*.gql');
    return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;

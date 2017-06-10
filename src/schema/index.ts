
import { GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import {getTypeDefs, getResolvers} from '../lib/makeSchema';
const resolverFiles = (require as any).context('./schema', true, /resolver\.ts/);

const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const createSchema = async (): Promise<GraphQLSchema> => {
    const typeDefs = await getTypeDefs();
    const resolvers = mergeResolvers(resolversLoad);
    return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;

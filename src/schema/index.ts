
import { GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import { getTypeDefs } from '../lib/makeSchema';
const resolverFiles = (require as any).context('./', true, /resolver\.ts/);

const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const createSchema = async (): Promise<GraphQLSchema> => {
    const typeDefs = await getTypeDefs();
    const resolvers = mergeResolvers(resolversLoad);
    return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;


import { GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import { getTypeDefs } from '../lib/makeTypeDefs';

const resolverFiles = (require as any).context('./', true, /resolver\.ts/);

// get resolver objects
const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];

const createSchema = async (): Promise<GraphQLSchema> => {
    const typeDefs = await getTypeDefs();
    return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;

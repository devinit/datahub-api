
import {GraphQLSchema} from 'graphql';
import { mergeGraphqlSchemas, mergeResolvers } from 'merge-graphql-schemas';


const resolverFiles = (require as any).context('./example', true, /resolver\.ts/);
const typeFiles = (require as any).context('./example', true, /\.gql/);

const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const typesLoad: any[] = typeFiles.keys().map(typeName => typeFiles(typeName));

export const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];
export const typeDefs = typesLoad.length > 1 ?
    mergeGraphqlSchemas(typesLoad) : typesLoad[0];


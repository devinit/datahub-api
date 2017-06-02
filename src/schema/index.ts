
import {GraphQLSchema} from 'graphql';
import { mergeGraphqlSchemas, mergeResolvers } from 'merge-graphql-schemas';


const moduleFiles = (require as any).context('./', true, /\.ts/);

const resolversLoad: any[] = [];
const typesLoad: any[] = [];

moduleFiles.keys().map((moduleName) => {
    if (moduleName.includes('resolver.ts')) {
        console.log('found resolver', moduleName);
        return resolversLoad.push(moduleFiles(moduleName).default);
    }
    if (moduleName.includes('types.ts')) {
        console.log('found type', moduleName);
        return typesLoad.push(moduleFiles(moduleName).default);
    }
});

export const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];
export const typeDefs = typesLoad.length > 1 ?
    mergeGraphqlSchemas(typesLoad) : typesLoad[0];



import {GraphQLSchema} from 'graphql';
import { mergeGraphqlSchemas, mergeResolvers } from 'merge-graphql-schemas';
import { generateNamespace } from '@gql2ts/from-schema';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import * as fs from 'fs';

const resolverFiles = (require as any).context('./example', true, /resolver\.ts/);
const typeFiles = (require as any).context('./example', true, /\.gql/);

const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const typesLoad: any[] = typeFiles.keys().map(typeName => typeFiles(typeName));


const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];
const typeDefs: string = typesLoad.length > 1 ?
    mergeGraphqlSchemas(typesLoad) : typesLoad[0];

// TODO turn into webpack loader
const generateTSTypes = () => {
    const myNamespace = generateNamespace('DHschema', typeDefs);
    const typesPath = path.resolve('./src/typings/graphql.d.ts');
    return fs.writeFile(typesPath, myNamespace);
};

// generates typescript types from graphql schema types
if (process.env.NODE_ENV !== 'production') generateTSTypes();

const schema = makeExecutableSchema({ typeDefs, resolvers });

// const effectiveSchema =
//     process.env.NODE_ENV !== 'production' ?
//         forbidUndefinedInResolve(schema) : schema;

export default schema;

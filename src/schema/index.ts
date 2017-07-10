
import { GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import { getTypeDefs } from '../lib/makeTypeDefs';
import {precache} from '../lib/cache';
import db from './dw/db';
import cms from './cms';

const resolverFiles = (require as any).context('./', true, /resolver\.ts/);

// get graphql resolver objects
const resolversLoad: any[] = resolverFiles.keys()
    .map(moduleName => resolverFiles(moduleName).default);

const resolvers = resolversLoad.length > 1
    ? mergeResolvers(resolversLoad) : resolversLoad[0];

// TODO: use & to ceate the resulting returned type
export const createSchema = async (): Promise<any> => {
    const typeDefs = await getTypeDefs();
    const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
    return { schema, context: {dw: db, cms} };
};

export const preCacheAll = async () => {
    await precache({
        cms: cms.get,
        dw: db.manyCacheable
    });
};

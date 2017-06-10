
import { GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import {getTypeDefs, getResolvers} from '../lib/makeSchema';

const createSchema = async (): Promise<GraphQLSchema> => {
    const typeDefs = await getTypeDefs();
    const resolvers = await getResolvers();
    return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;

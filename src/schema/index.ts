
import { mergeGraphqlSchemas } from 'merge-graphql-schemas';
import * as path from 'path';

const schemaPath = path.join(__dirname, './schema');

const schema = mergeGraphqlSchemas(schemaPath);

export  default schema;

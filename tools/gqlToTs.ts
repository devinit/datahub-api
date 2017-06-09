/**
 * looks for .gql or .graphql files
 * and builds out TS types for them
 * depends on @gql2ts/from-schema && merge-graphql-schemas
 * for core functionality
 */

import * as glob from 'glob-promise';
import { mergeTypes } from 'merge-graphql-schemas';
import { generateNamespace } from '@gql2ts/from-schema';
import * as fs from 'fs-extra';
import * as R from 'ramda';

export const normalizeMergedTypes: (mergedTypes: string[]) => string
    = R.compose(R.replace(/\s+/g, ''), R.join(''));

export interface IgqlTsOpts {
    globPattern?: string;
    outFile?: string;
}

const defaults: IgqlTsOpts  = {
    globPattern: '**/*.gql',
    outFile: ''
};

const readFile: (fileName: string) => Promise<string> =
    (fileName) => fs.readFile(fileName, 'utf8');

export const getTypeDefs: (globPattern?: string) => Promise<string> = async (globPattern) => {
    try {
        const files: string[]  = await glob(globPattern);
        const typesLoad: string[] = await Promise.all(R.map(readFile, files));
        const mergedTypes: string[] = mergeTypes(typesLoad);
        return normalizeMergedTypes(mergedTypes);
    } catch (error) {
        console.error(error);
    }
};

export const main: (options?: IgqlTsOpts) =>  Promise <string | any> = async (options = {}) => {
    const opts = Object.assign(defaults, options);
    try {
        const typeDefs: string = await getTypeDefs(opts.globPattern);
        const namespaceOpts = { ignoreTypeNameDeclaration: true};
        const tsNameSpace: string = generateNamespace('DHschema', typeDefs, namespaceOpts, {});
        if (opts.outFile && opts.outFile.length) fs.writeFile(opts.outFile, tsNameSpace);
        return tsNameSpace;
    } catch (error) {
        console.error(error);
    }
};

if (process.env.NODE_ENV !== 'test') main({outFile: './src/typings/graphql.d.ts'});

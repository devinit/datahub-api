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

export const normalizeWhitespace: (str: string) => string =
    (str) => str.replace(/\\/, '').trim();

export const normalizeMergedTypes: (mergedTypes: string[]) => string
    = R.compose(normalizeWhitespace, R.join(''));

export interface IgqlTsOpts {
    globPattern: string;
    outFile: string;
}

const defaults: IgqlTsOpts  = {
    globPattern: '**/*.gql',
    outFile: ''
};

const readFile: (fileName: string) => Promise<string> =
    (fileName) => fs.readFile(fileName, 'utf8');

export const getTypeDefs: (globPattern: string) => string = async (globPattern) => {
    try {
        const files: string[]  = await glob(globPattern);
        const typesLoad: string[] = await Promise.all(R.map(readFile, files));
        const mergedTypes: string[] = mergeTypes(typesLoad);
        return normalizeMergedTypes(mergedTypes);
    } catch (error) {
        console.error(error);
    }
};

export const main: (options: IgqlTsOpts) => void = async (options: IgqlTsOpts) => {
    const opts = Object.assign(defaults, options);
    try {
        const typeDefs = await getTypeDefs(opts.globPattern);
        const namespaceOpts = {
            ignoreTypeNameDeclaration: true
        };
        const tsNameSpace = generateNamespace('DHschema', typeDefs, namespaceOpts);
        if (opts.outFile.length) await fs.writeFile(opts.outFile, tsNameSpace);
        return tsNameSpace;
    } catch (error) {
        console.error(error);
    }
};

if (process.env.NODE_ENV !== 'test') main();

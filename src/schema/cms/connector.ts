import axios from 'axios';
import * as R from 'ramda';
import * as LRU from 'lru-cache';
import * as converter from 'csvtojson';
import {queue} from '../../utils';
import {precache} from '../../lib/cache';

const baseUrl = 'https://raw.githubusercontent.com/devinit/datahub-cms/master';

const createUrl: (endPoint: string) => string = (endPoint) => `${baseUrl}/${endPoint}`;

const httpGet: (api: string) => Promise < string > = R.composeP(R.prop('data'), axios.get);

const lruOpts: LRU.Options<any> = {
    max: 300,
    maxAge: 1000 * 60 * 60 * 60 // TODO: create time constant
};

export const cache: LRU.Cache<any> = LRU(lruOpts);

export const csvToJson = <T extends {}> (csvStr: string): Promise<T[]>  =>
    new Promise(<T>(resolve, reject) => {
        const data: T[] = [];
        converter({workerNum: 2})
        .fromString(csvStr)
        .on('json', (json) => {
            data.push(json);
        })
        .on('done', (error) => {
            resolve(data);
            reject(error);
        });
    });

export const get = async <T extends {}> (endPoint: string): Promise <T[]> => {
    const api = createUrl(endPoint);
    console.log('api: ', api);
    if (cache.has(endPoint))  {
        // add to queue so that we always have freshest data
        queue(endPoint, 'cms', cache, get); // makes same query in 15 minutes so as to update cache
        return cache.get(api) as T[];
    }
    const csvStr = await httpGet(api);
    const data: T[] = await csvToJson<T>(csvStr);
    cache.set(endPoint, data);
    return data;
};

export const initPrecache = () => precache(cache, {cms: get});

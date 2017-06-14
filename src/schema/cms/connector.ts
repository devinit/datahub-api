import axios from 'axios';
import * as R from 'ramda';
import * as LRU from 'lru-cache';
import * as converter from 'csvtojson';

const baseUrl = 'https://raw.githubusercontent.com/devinit/datahub-cms/master';

const createUrl: (endPoint: string) => string = (endPoint) => `${baseUrl}/${endPoint}`;

const httpGet: (api: string) => Promise < string > = R.pipeP(axios.get, R.prop('data'));

// TODO: exported so that we can do cache state management
export const cache = LRU({
    max: 50,
    maxAge: 1000 * 60 * 60
});

export const csvToJson = <T> (csvStr: string): Promise<T[]>  =>
    new Promise(<T>(resolve, reject) => {
        const data: T[] = [];
        converter({workerNum: 2})
        .fromString(csvStr)
        .on('json', (json: T) => {
            data.push(json);
        })
        .on('done', (error) => {
            resolve(data);
            reject(error);
        });
    });

export const get = async <T> (endPoint: string): Promise <T[]> => {
    const api = createUrl(endPoint);
    // if (cache.has(endPoint))  {
    //     const cached: T[] = cache.get(endPoint);
    //     return cached;
    // }
    const csvStr = await httpGet(api);
    const data: T[] = await csvToJson<T>(csvStr);
    // cache.set(endPoint, data);
    return data;
};

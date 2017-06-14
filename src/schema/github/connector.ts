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

export const csvToJson: <T> (csvStr: string) => Promise<T[]> = (csvStr) =>
    new Promise((resolve, reject) => {
        const data = [];
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

export const get: <T> (endPoint: string) => Promise <T[]> = async (endPoint) => {
    const api = createUrl(endPoint);
    if (cache.has(endPoint)) return cache.get(endPoint);
    try {
        const csvStr = await httpGet(api);
        const data = await csvToJson(csvStr);
        cache.set(endPoint, data);
        return data;
    } catch (error) {
        console.error(error);
    }
};

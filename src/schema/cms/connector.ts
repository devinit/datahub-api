import * as https from 'https';
import * as LRU from 'lru-cache';
import * as converter from 'csvtojson';
import {queue} from '../../lib/cache';

// connections over github connection options
const options: https.RequestOptions = {
  hostname: 'raw.githubusercontent.com',
  port: 443,
  path: '/devinit/datahub-cms/master',
  timeout: 120000 * 2, // 4 mins
  method: 'GET',
  agent: false
};

export const httpsGet = (endPoint: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const opts = {...options, path: `${options.path}/${endPoint}` };
        let str = '';
        const req = https.request(opts, (res) => {
            res.setEncoding('utf8');
            res.on('data', (data) => {
                str = str + data;
            });
            if (res.statusCode === 404) reject(`${opts.path} not found`);
            res.on('end', () => resolve(str));
            res.on('error', (error) => reject(`Response error: ${error}`));
        });
        req.on('error', (error) => {
           throw new Error(`Request error: ${error.message}`);
        });
        req.on('aborted', (error) => {
            throw new Error (`Request aborted ${error}`);
        });
        req.end();
    });
};

const lruOpts: LRU.Options<any> = {
    max: 300,
    maxAge: 1000 * 60 * 60 * 24 * 60 // TODO: create time constant (60 days -- 2 months)
};

export const cache: LRU.Cache<any> = LRU(lruOpts);

export const csvToJson = <T extends {}> (csvStr: string): Promise<T[]>  =>
    new Promise((resolve, reject) => {
        const data: T[] = [];
        converter({workerNum: 2, delimiter: ','})
        .fromString(csvStr)
        .on('json', (json) => {
            data.push(json);
        })
        .on('done', (error) => {
            resolve(data);
            reject(error);
        })
        .on('error', (err) => {
            throw new Error(`csv to json: ${err}`);
        });
    });

export const get = async <T extends {}> (endPoint: string): Promise <T[]> => {
    try {
        if (cache.has(endPoint))  {
            // add to queue so that we always have freshest data
            queue(endPoint, 'cms', cache, get); // makes same query in 15 minutes so as to update cache
            return cache.get(endPoint) as T[];
        }
        const csvStr = await httpsGet(endPoint); // TODO: if github is down, fetch from a cache dumb
        const data: T[] = await csvToJson<T>(csvStr);
        cache.set(endPoint, data);
        return data;
    } catch (error) {
        throw new Error(` Error getting data for ${endPoint}: \n ${error}`);
    }
};

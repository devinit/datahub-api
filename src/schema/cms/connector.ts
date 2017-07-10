import * as https from 'https';
import * as LRU from 'lru-cache';
import * as converter from 'csvtojson';
import {queue} from '../../lib/cache';

// connections over github connection options
const options: https.RequestOptions = {
  hostname: 'raw.githubusercontent.com',
  port: 443,
  path: '/devinit/datahub-cms/master',
  method: 'GET',
  agent: false
};
const keepAliveAgent = new https.Agent({ keepAlive: true });
options.agent = keepAliveAgent;

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
            res.on('error', (error) => reject(`On request error: ${error}`));
        });
        // req.on('socket', (socket) => {
        //     socket.emit('agentRemove');
        // });
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

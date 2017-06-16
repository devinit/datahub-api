/**
 * has function that saves out all queried keys from our LRU caches into a json file
 * has function that gets data from all the keys and precaches as app starts
 */
import * as LRU from 'lru-cache';
import * as fs from 'fs-extra';

export interface IIsCached {
    key: string;
    isCached: boolean;
}
export interface ICached {
    key: string;
    type: string;
}

export interface IFetchFnObj {
    [key: string]: (string) => Promise<any>;
}

export const readCacheData: (file?: string) => Promise<ICached[]> =
    async (file = './cache.json') => {
        const data: string = await fs.readFile(file, 'utf-8');
        return data.split('\n')
            .map(line => {
                const lineArr = line.split(/\s/);
                return {key: lineArr[0], type: lineArr[1]};
            });
    };

export const precache: (cache: LRU.Cache<any>, fetchFnObj: IFetchFnObj, cacheFile?: string) =>
    Promise< Array<Promise<IIsCached>> > | Error = async (cache, fetchFnObj, cacheFile = './cache.json') => {
         try {
            const fileExist: boolean = fs.existsSync(cacheFile);
            if (!fileExist) throw new Error('file doesnt exist');
            const cachedData: ICached[] = await readCacheData();
            const result: Array<Promise<IIsCached>> = cachedData.map( async ({key, type}: ICached) => {
                try {
                    const data = await fetchFnObj[type](key);
                    cache.set(key, data);
                    return { key, isCached: true};
                } catch (error) {
                    if (error) console.error(error);
                    return { key, isCached: false};
                }
            });
            return result;
        } catch (error) {
           if (error) console.error(error);
           return error;
        }
    };

import {IMain, IDatabase, IOptions} from 'pg-promise';
import {dwConfig} from '../config';
import Maps from '../modules/Maps';
import diagnostics from './diagnostics';
import * as pgPromise from 'pg-promise';
import * as LRU from 'lru-cache';

export interface IExtensions {
    maps: Maps;
    manyCacheable: (query: string, values: any) => Promise<any>;
}

export const dbCache = LRU({
    max: 500,
    maxAge: 1000 * 60 * 60 * 60 // TODO: create time constant
});

// pg-promise initialization options:
const options: IOptions<IExtensions> = {
    // Extending the database protocol with our custom modules
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend: (obj: IExtensions & IDatabase<IExtensions>) => {
        obj.manyCacheable = (query, values) => {
            const getQuery = pgPromise.as.format(query, values);
            if (dbCache.has(getQuery)) return Promise.resolve(dbCache.get(getQuery));
            return obj.many(getQuery);
        };
        obj.maps = new Maps(obj);
    },
    // caching
    receive: (data, _result, event) => {
        // cache recieved
        if (!dbCache.has(event.query)) dbCache.set(event.query, data);
    }
};

const pgp: IMain = pgPromise(options);

// Create the database instance with extensions:

const db = pgp(dwConfig) as IDatabase<IExtensions> & IExtensions;

// Load and initialize optional diagnostics:

if (process.env.NODE_ENV === 'production') diagnostics.init(options);

process.on('exit', (code) => {
  // kill db
  pgp.end();
  console.log(`About to exit with code: ${code}, closed DB connection`);
});

process.on('SIGINT', () => {
    // kill db
    pgp.end();
    console.log('Ctrl-C... forced termination closed DB connection');
});

// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export default db;

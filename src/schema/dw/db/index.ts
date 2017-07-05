import {IMain, IDatabase, IOptions} from 'pg-promise';
import {dwConfig} from '../config';
import Maps from '../modules/Maps';
import UnbundlingAid from '../modules/UnbundlingAid';
import CountryProfile from '../modules/CountryProfile';
import diagnostics from './diagnostics';
import * as pgPromise from 'pg-promise';
import * as LRU from 'lru-cache';
import {queue} from '../../../lib/cache';

export interface IExtensions {
    maps: Maps;
    unbundlingAid: UnbundlingAid;
    countryProfile: CountryProfile;
    manyCacheable: (query: string, values: any) => Promise<any>;
}

const lruOpts: LRU.Options<any> = {
    max: 500,
    maxAge: 1000 * 60 * 60 * 60
};

export const dbCache: LRU.Cache<any> = LRU(lruOpts);

// pg-promise initialization options:
const options: IOptions<IExtensions> = {
    // Extending the database protocol with our custom modules
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend: (obj: IExtensions & IDatabase<IExtensions>) => {
        obj.manyCacheable = (query: string, values?: any) => {
            const getQuery = values ? pgPromise.as.format(query, values) : query;
            if (dbCache.has(getQuery)) {
                // add to queue so that we always have freshest data
                // makes same query in 15 minutes so as to update cache
                queue(getQuery, 'dw', dbCache, obj.many);
                return Promise.resolve(dbCache.get(getQuery));
            }
            return obj.any(getQuery);
        };
        obj.maps = new Maps(obj);
        obj.countryProfile = new CountryProfile(obj);
        obj.unbundlingAid = new UnbundlingAid(obj);
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

diagnostics.init(options);

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

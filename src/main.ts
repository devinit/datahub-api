import { main } from '@devinit/graphql-next';
import { precache } from '@devinit/graphql-next/lib/cache';
import db from '@devinit/graphql-next/lib/db';
import { githubGet } from '@devinit/graphql-next/lib/github';
import apiModules from './modules';

// starts app
main({
    resolverPattern: '**/dist/modules/**/resolver.js', // we want compile resolvers
    apiModules,
    port: Number(process.env.PORT || 3000)
});

if (process.env.NODE_ENV === 'production') {
    // run queries in the .cache file, subsequently caching their results in an LRU cache
    precache({
        cms: githubGet, // can be change to ref look in .cache
        dw: db.manyCacheable
    }).catch(console.error);
}

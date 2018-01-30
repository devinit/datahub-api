import {main} from '@devinit/graphql-next';
import {precache} from '@devinit/graphql-next/lib/cache';
import db from '@devinit/graphql-next/lib/db';
import {githubGet} from '@devinit/graphql-next/lib/github';
import apiModules from './modules';

// starts app
main({
    resolverPattern: '**/dist/modules/**/resolver.js', // we want compile resolvers
    apiModules,
    port: process.env.PORT || 3000
});

precache({
    cms: githubGet, // can be change to ref look in .cache
    dw: db.manyCacheable
}).catch(console.error);

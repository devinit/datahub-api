import {main} from '@devinit/graphql-next';
import {preCacheAll} from '@devinit/graphql-next/lib/schema';
import apiModules from './modules';

// starts app
main({
    resolverPattern: '**/lib/modules/**/resolver.js', // we want compile resolvers
    apiModules,
    port: process.env.PORT || 3000
});

if (process.env.NODE_ENV === 'production') preCacheAll();

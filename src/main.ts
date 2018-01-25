import {main} from '@devinit/graphql-next';
import {preCacheAll} from '@devinit/graphql-next/lib/schema';
// import brazil from './modules/brazil';
// import china from './modules/china';
// import india from './modules/india';
// import shared from './modules/shared';
// import southAfrica from './modules/southAfrica';

const apiModules = [];

// starts app
main({
    resolverPattern: '**/lib/modules/**/resolver.js', // we want compile resolvers
    apiModules,
    port: process.env.PORT || 3000
  });
if (process.env.NODE_ENV === 'production') preCacheAll();

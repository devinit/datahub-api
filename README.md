# Data hub graphql-server

[![Build Status](https://travis-ci.org/devinit/datahub-api.svg?branch=master)](https://travis-ci.org/devinit/datahub-api)
[![codecov](https://codecov.io/gh/devinit/datahub-api/branch/master/graph/badge.svg)](https://codecov.io/gh/devinit/datahub-api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e501f77141774b74979c60d5cfd219ac)](https://www.codacy.com/app/epicallan/datahub-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=devinit/datahub-api&amp;utm_campaign=Badge_Grade)
[![Dependency Status](https://gemnasium.com/badges/github.com/devinit/datahub-api.svg)](https://gemnasium.com/github.com/devinit/datahub-api)
[![npm version](https://badge.fury.io/js/%40devinit%2Fdatahub-api.svg)](https://badge.fury.io/js/%40devinit%2Fdatahub-api)
### Graphql server for the data-hub application.

Dataware house & Github CMS integration
-----
This project has a dataware house module thats responsible for getting data from the datawarehouse and merge it with refrence data from a github repo acting as a CMS. 
The github repo (cms) contains refrence files such as colors, country names etc.

This data is served over a graphql API.


Useful commands:
----
    npm run build       - build the library files (Required for start:watch)
    npm start           - Start the server
    npm run dev         - Start the server in watchmode (Useful for development)
    npm test            - run tests once
    npm run deploy      - will deploy app to now.sh make sure you have the DB access credentials in your system env file eg .bash_profile

How to run it:
----
```bash
    npm install -g yarn # if you dont have yarn installed
    yarn # install dependencies
    ## development mode
    npm run dev
    ## run in production
    npm start
```



Development guidelines
------
- When you install a new dependency add its types from definetly typed typescript incase it doesnt come with any

eg ```  yarn add --dev @types/ramda ```
- Whenever you change the .gql files run ```npm run gqlToTs``` so that resolvers and type definitions are generated for use in graphql


On data caching
-----

Every new instance of this node app starts with a fresh LRUcache which will be populated by items that get requested through the lifecycle of the application.

The app also persists queries on each data requests and does pre-caching of these queries on app boot.

During development; inorder to keep having fresh data, every data request is added to a queue as it gets served from the cache. This queue is ran in the background and updates after an hour of the request with new data if any.

```.cache```  file contains all the queries occuring in the life time of the app. Its in git history so that we can precache those queries on app boot. (TODO: Make this run in another process)

Deployment
---------
We are currently test deploying with now and they freeze inactive normal deployments. In order to create a deployment that's always active consider scaling your deploy

```now scale my-deployment-ntahoeato.now.sh 1```

Notes
-------

- This repo is published to npm so that we can reuse its types
- for database access look in the @devinit/graphql/next package


TODO
----------

- [ ] remove console.info & console.error and replace with function that logs to an info & error file
- [ ] fix testing on travis
- [ ] Make uid immutable for testing purposes
- [ ] pull in di_id as id in sql queries
- [ ] Perf: breakdown tabs data fetching function into individual functions

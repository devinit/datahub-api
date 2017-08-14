# Data hub graphql-server

[![Build Status](https://travis-ci.org/devinit/datahub-api.svg?branch=master)](https://travis-ci.org/devinit/datahub-api)
![Code Climate](https://codeclimate.com/github/devinit/datahub-api.svg)
[![codecov](https://codecov.io/gh/devinit/datahub-api/branch/master/graph/badge.svg)](https://codecov.io/gh/devinit/datahub-api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e501f77141774b74979c60d5cfd219ac)](https://www.codacy.com/app/epicallan/datahub-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=devinit/datahub-api&amp;utm_campaign=Badge_Grade)
[![Dependency Status](https://gemnasium.com/badges/github.com/devinit/datahub-api.svg)](https://gemnasium.com/github.com/devinit/datahub-api)

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
    npm install 
    ## development mode
    npm run dev
    ## production
    npm run build & npm start
```

When you install a new dependency add its types from definetly typed typescript incase it doesnt come with any

eg ```  yarn add --dev @types/ramda ```

Files explained:
----
    1. src                         - directory is used for typescript code that is part of the project
        1a. main.ts                - Main server file.
        1c. dw/schema              - Contains modules used to build dataware house schemas
            - modules/             - directory for modules
    3. package.json                - file is used to describe the library
    4. tsconfig.json               - configuration file for the library compilation
    6. tslint.json                 - configuration file for the linter
    8. webpack.config.js           - configuration file of the compilation automation process for the library
    10. Dockerfile                 - Dockerfile used to describe how to make a container for the server

Development guidelines
------

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

TODO
- [ ] remove console.info & console.error and replace with function that logs to an info & error file
- [ ] fix testing on travis
- [ ] pull in color data into the repo
- [ ] pull in di_id as id in sql queries

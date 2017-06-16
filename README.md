# Data hub graphql-server

[![Build Status](https://travis-ci.org/devinit/datahub-api.svg?branch=master)](https://travis-ci.org/devinit/datahub-api)
![Code Climate](https://codeclimate.com/github/devinit/datahub-api.svg)
[![codecov](https://codecov.io/gh/devinit/datahub-api/branch/master/graph/badge.svg)](https://codecov.io/gh/devinit/datahub-api)
[![Dependency Status](https://gemnasium.com/badges/github.com/devinit/datahub-api.svg)](https://gemnasium.com/github.com/devinit/datahub-api)

### Graphql server for the data-hub application.

This project has no issue tracker. All its issues and project management will be handled from the datahub react repo.

Dataware house & Github CMS integration
-----
This project has a dataware house module thats responsible for getting data from the datawarehouse and merge it with refrence data from a github repo acting as a CMS. 
The github repo (cms) contains refrence files such as colors, country names etc.

This data is served over a graphql API.


Useful commands:
----
    npm run build       - build the library files (Required for start:watch)
    npm run build:watch - build the library files in watchmode (Useful for development)
    npm start           - Start the server
    npm run dev         - Start the server in watchmode (Useful for development)
    npm test            - run tests once
    npm run test:watch  - run tests in watchmode (Useful for development)

How to run it:
----
```bash
    yarn install --ignore-scripts
    ## development mode
    npm run dev
    ## production
    npm run build & npm start
```

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


Output files explained:
----
    1. node_modules - directory npm creates with all the dependencies of the module (result of npm install)
    2. dist         - directory contains the compiled server (javascript)
    3. html-report  - output of npm test, code coverage html report.

On data caching
-----

Every new instance of this node app starts with a fresh LRUcache which will be populated by items that get requested through the lifecycle of the application.
If the remote data thats getting cached changes you currently have to restart the app in order to have new fresh cache. This is ok in development but not good for production.

TODO: create a function that listens to the github repo so that it refetches cached keys


Development Experience Issues
-----

For some strange reason ctrl-c doesnt completely kill off the server, this is possibly a webpack or node-dev issue
To kill the process find it with ```lsof -i tcp:3000``` if on linux and then kill it with ``` kill 9 <PID>```

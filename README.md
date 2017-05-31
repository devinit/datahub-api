# Data hub graphql-server

 [![Build Status](https://travis-ci.org/DxCx/datahub-api.svg?branch=master)](https://travis-ci.org/DxCx/datahub-api) [![Coverage Status](https://coveralls.io/repos/github/DxCx/datahub-api/badge.svg?branch=master)](https://coveralls.io/github/DxCx/datahub-api?branch=master)
 ![Code Climate](https://codeclimate.com/github/devinit/datahub.svg)
[![codecov](https://codecov.io/gh/devinit/datahub-api/branch/master/graph/badge.svg)](https://codecov.io/gh/devinit/datahub-api)
[![Dependency Status](https://gemnasium.com/badges/github.com/devinit/datahub-api.svg)](https://gemnasium.com/github.com/devinit/datahub-api)

Graphql server for the data-hub application.

This project has no issue tracker. All its issues and project management will be handled from the datahub react repo

Useful commands:
----
    npm run build       - build the library files (Required for start:watch)
    npm run build:watch - build the library files in watchmode (Useful for development)
    npm start           - Start the server
    npm run dev         - Start the server in watchmode (Useful for development)
    npm test            - run tests once
    npm run test:watch  - run tests in watchmode (Useful for development)
    npm run test:growl  - run tests in watchmode with growl notification (even more useful for development)
    npm run upver       - runs standard-version to update the server version.

How to run it:
----
```bash
    npm start
```

Files explained:
----
    1. src                         - directory is used for typescript code that is part of the project
        1a. main.ts                - Main server file. (Starting Apollo server)
        1b. main.spec.ts           - Tests file for main
        1c. schema                 - Module used to build schema
            - index.ts             - simple logic to merge all modules into a schema using graphql-tools
            - modules/             - directory for modules to be used with graphql-tools
        1c. schema.spec.ts         - Basic test for schema.
        1c. main.test.ts           - Main for tests runner.
    3. package.json                - file is used to describe the library
    4. tsconfig.json               - configuration file for the library compilation
    6. tslint.json                 - configuration file for the linter
    7. typings.json                - typings needed for the server
    8. webpack.config.js           - configuration file of the compilation automation process for the library
    9. webpack.config.test.js      - configuration file of the compilation when testing
    10. Dockerfile                 - Dockerfile used to describe how to make a container out of apollo server


Output files explained:
----
    1. node_modules - directory npm creates with all the dependencies of the module (result of npm install)
    2. dist         - directory contains the compiled server (javascript)
    3. html-report  - output of npm test, code coverage html report.

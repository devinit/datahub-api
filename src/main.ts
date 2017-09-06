import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as LRU from 'lru-cache';
import {createSchema, preCacheAll} from './schema';

// Default port or given one.
export const GRAPHQL_ROUTE = '/graphql';
export const GRAPHIQL_ROUTE = '/graphiql';

export interface IMainOptions {
  enableCors: boolean;
  enableGraphiql: boolean;
  env: string;
  port: number;
  verbose ?: boolean;
}

/* istanbul ignore next: no need to test verbose print */
function verbosePrint(port, enableGraphiql) {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_ROUTE}`);
  if (true === enableGraphiql) {
    console.log(`GraphiQL Server is now running on http://localhost:${port}${GRAPHIQL_ROUTE}`);
  }
}

const graphqlMiddleware = [
  bodyParser.text({
    type: 'application/graphql'
  }),
  // tslint:disable-next-line:variable-name
  (req, _res, next) => {
    if (req.is('application/graphql')) {
      req.body = {
        query: req.body
      };
    }
    next();
  }
];

const lruOpts: LRU.Options<any> = {
  max: 500,
  maxAge: 1000 * 60 * 60 * 60
};

export const appCache: LRU.Cache<any> = LRU(lruOpts);

const appCacheMiddleWare = (req, res, next) => {
  const query = JSON.stringify(req.body.query + req.body.variables); // TODO: turn into ashorter key
  if (appCache.has(query)) {
    return res.status(200)
      .json(JSON.parse(appCache.get(query)));
  }
  return next();
};

export async function main(options: IMainOptions) {
  const app = express();

  app.use(helmet());

  app.use(bodyParser.json());

  app.use(morgan('tiny')); // TODO: log to file

  if (true === options.enableCors) app.use(GRAPHQL_ROUTE, cors());

  app.use(compression());

  app.use(GRAPHQL_ROUTE, appCacheMiddleWare);

  try {
    const schema = await createSchema();
    app.use(GRAPHQL_ROUTE, ...graphqlMiddleware, (req, res, next) => {
      return graphqlExpress({
        ...schema,
        formatResponse: (data) => {
          setImmediate(() => {
            const query = JSON.stringify(req.body.query + req.body.variables);
            appCache.set(JSON.stringify(query), JSON.stringify([data]));
          });
          return data;
        }
      })(req, res, next);
    });
    if (options.enableGraphiql) {
      app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
    }
    return new Promise((resolve) => {
      const server = app.listen(options.port, () => {
        /* istanbul ignore if: no need to test verbose print */
        if (options.verbose) {
          verbosePrint(options.port, options.enableGraphiql);
        }
        resolve(server);
      }).on('error', (err: Error) => {
        console.error(err);
      });
    });
  } catch (error) {
    if (error) console.error(error);
  }
}

/* istanbul ignore if: main scope */
// for testing purposes. during testing its required as a module and hence the code below wont run
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  const NODE_ENV = process.env.NODE_ENV !== 'production' ? 'dev' : 'production';

  process.on('uncaughtException', (err) => {
    console.error('uncaught exception', err);
  });

  main({
    enableCors: true,
    enableGraphiql: true,
    env: NODE_ENV,
    port: PORT,
    verbose: true,
  }).catch(console.error);
  if (NODE_ENV === 'production') preCacheAll();
}
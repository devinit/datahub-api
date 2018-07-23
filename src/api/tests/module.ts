// a module can be a function / class that require db as an argument
// import {IDB} from '../db';
// export default {apiDataModule: (db: IDB) => {
// some function that requires db
// dbFunc(db);
// } };
export default { apiName: () => ({ name: 'Graphql-API' }) };

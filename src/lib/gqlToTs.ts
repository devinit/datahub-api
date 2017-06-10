import { generateTsFromGql, getTypeDefs} from './makeSchema';

generateTsFromGql({outFile: './typings/global.d.ts', globPattern: '**/schema/*.gql'});

const makeTypeDefs = require('../dist/makeTypeDefs');

try {
    makeTypeDefs.generateTsFromGql({outFile: 'src/types/dh.d.ts'});
} catch(error) {
    console.log(error);
}
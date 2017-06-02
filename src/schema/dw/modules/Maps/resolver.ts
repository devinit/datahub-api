import model from './model';
import {getCurrentYear} from '../../../utils';

interface IMap {
    connection: any; // should be DB connection type
    type: string;
    startYear: number;
    endYear: number;
}

const CURRENT_YEAR =  getCurrentYear();

export default {
  Query: {
    getMapData(root, {type, startYear = 0, endYear = CURRENT_YEAR}, ctx) {
      return model.getMapData({
          connection: ctx.connection,
          type,
          startYear,
          endYear}: IMap);
    }
  }
};

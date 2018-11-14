// import { IConcept, getConceptAsync } from '../../refs/concept';
import { IDB } from '../../../api/db';
import { getIndicatorData } from '../../utils';
import { IGetIndicatorArgs, IRAW } from '../../utils/types';

export class RecipientProfiles {
  // tslint:disable
  private SQL = {
    ODAPerPercentGDP: 'SELECT value, year FROM recipient_profile.oda_per_percent_gdp WHERE di_id =${id} AND year >= ${start_year}',
    ODAPerPercentGDPExclNonTransfer: 'SELECT value, year FROM recipient_profile.oda_per_percent_gdp_excl_non_transfer WHERE di_id =${id} AND year >= ${start_year}'
  };
  // tslint:enable
  private db: IDB;
  private defaultOptions: Partial<IGetIndicatorArgs>;

  constructor(db: IDB) {
    this.db = db;
    this.defaultOptions = { db: this.db, conceptType: 'country-profile' };
  }

  async getRecipientODAProfiles({ id }) {
    try {
      const ODAPerPercentGDP = this.getODATableData(id, this.SQL.ODAPerPercentGDP);
      const ODAPerPercentGDPExclNonTransfer = this.getODATableData(id, this.SQL.ODAPerPercentGDPExclNonTransfer);

      return {
        ODAPerPercentGDP,
        ODAPerPercentGDPExclNonTransfer
      };
    } catch (error) {
      throw error;
    }
  }

  private async getODATableData(id: string, query: string) {
    try {
      // const concept: IConcept = await getConceptAsync('country-profile', 'recipient_profile.oda_per_percent_gdp');
      const indicatorOptions = { query, ...this.defaultOptions, id };
      const tableData: IRAW[] = await getIndicatorData<IRAW>(indicatorOptions as IGetIndicatorArgs);

      return tableData;
    } catch (error) {
      throw error;
    }
  }
}

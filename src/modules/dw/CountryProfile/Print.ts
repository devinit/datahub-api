import { getPrintNarrative } from '../../refs/print';

export class Print {
  async getPrintNarratives({ id }): Promise<any[]> {
    try {
      const narrative = await getPrintNarrative(id);

      return narrative || [];
    } catch (error) {
      if (error.message && error.message.indexOf('not found')) {
        return [];
      }

      throw error;
    }
  }
}

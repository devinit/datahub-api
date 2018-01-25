import {
    IContext
} from '../../../../schema';

export default {
    Query: {
        async countries(_root, _args, ctx: IContext) {
          return await ctx.cms.getCountries();
        }
    }
};

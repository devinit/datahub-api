import { IContext } from '../../../modules';

export default {
    Query: {
        async countries(_root, _args, ctx: IContext) {
          return await ctx.modules.refs.getCountries();
        }
    }
};

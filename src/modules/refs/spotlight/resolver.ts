import {
    IContext
} from '../../../modules';

export default {
    Query: {
        async districts(_root, args, ctx: IContext) {
            if (!args.country) throw new Error('provide valid country name');
            return await ctx.modules.refs.getDistrictEntities(args.country);
        }
    }
};

import {IContext} from '../../../../schema';
export default {
    Query: {
        async methodology(_root, args, ctx: IContext) {
           return ctx.cms.getMethodologyData(args.moduleName);
        }
    }
};

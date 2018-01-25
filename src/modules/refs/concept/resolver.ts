import {IContext} from '../../../../schema';
export default {
    Query: {
        async methodology(_root, args, ctx: IContext) {
           return ctx.modules.getMethodologyData(args.moduleName);
        }
    }
};

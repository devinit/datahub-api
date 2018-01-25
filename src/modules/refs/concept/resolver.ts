import {IContext} from '../../../modules';
export default {
    Query: {
        async methodology(_root, args, ctx: IContext) {
           return ctx.modules.refs.getMethodologyData(args.moduleName);
        }
    }
};

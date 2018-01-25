import {IContext} from '../../../modules';

export default {
    Query: {
        async unbundlingAidData(_root, {args}, ctx: IContext) {
            return ctx.modules.unbundlingAid.getUnbundlingAidData(args);
        },
        async unbundlingAidDataTotal(_root, {args}, ctx: IContext) {
            return ctx.modules.unbundlingAid.getUnbundlingAidDataTotal(args);
        },
        async unbundlingSelectionData(_root, args, ctx: IContext) {
            return ctx.modules.unbundlingAid.getUnbundlingSelectionData(args);
        }
    }
};

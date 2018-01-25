import { IContext } from '../../../modules';

export default {
    Query: {
        async mapData(_root, args, ctx: IContext) {
           return ctx.modules.maps.getMapData(args.id);
        }
    }
};

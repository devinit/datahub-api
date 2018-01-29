import { IContext } from '../../../modules';

export default {
    Query: {
        async globalPictureThemes(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getGlobalPictureThemes();
        },
        async spotlightThemes(_root, args, ctx: IContext) {
           return ctx.modules.refs.getSpotlightThemes(args.country);
        },
    }
};

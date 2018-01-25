import {IContext} from '../../../../schema';
export default {
    Query: {
        async globalPictureThemes(_root, _args, ctx: IContext) {
           return ctx.modules.getGlobalPictureThemes();
        },
        async spotlightThemes(_root, args, ctx: IContext) {
           return ctx.modules.getSpotlightThemes(args.country);
        },
    }
};

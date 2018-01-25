import {IContext} from '../../../../schema';
export default {
    Query: {
        async globalPictureThemes(_root, _args, ctx: IContext) {
           return ctx.cms.getGlobalPictureThemes();
        },
        async spotlightThemes(_root, args, ctx: IContext) {
           return ctx.cms.getSpotlightThemes(args.country);
        },
    }
};

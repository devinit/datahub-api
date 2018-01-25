import {IRefs} from '../../refs';
export default {
    Query: {
        async globalPictureThemes(_root, _args, ctx: IContext<IRefs>) {
           return ctx.modules.refs.getGlobalPictureThemes();
        },
        async spotlightThemes(_root, args, ctx: IContext) {
           return ctx.modules.refs.getSpotlightThemes(args.country);
        },
    }
};

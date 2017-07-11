import {
    IContext
} from '../../../../schema';

export default {
    Query: {
        async countries(_root, _args, ctx: IContext) {
           return ctx.cms.getCountries();
        }
    }
};

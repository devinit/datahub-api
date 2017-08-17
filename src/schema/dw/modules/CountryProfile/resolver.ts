import {
    IContext
} from '../../../../schema';

export default {
    Query: {
        async governmentFinance(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.resources.getGovernmentFinance(args);
        },
        async internationalResources(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.resources.getInternationalResources(args);
        },
        async singleResource(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.resources.getSingleResource(args);
        },
        async overviewTab(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.tabs.getOverViewTab(args);
        },
        async flows(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.resources.getFlows(args.countryType);
        },
        async populationTab(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.tabs.getPopulationTab(args);
        },
        async povertyTab(_root, args, ctx: IContext) {
            return ctx.dw.countryProfile.tabs.getPovertyTab(args);
        }
    }
};

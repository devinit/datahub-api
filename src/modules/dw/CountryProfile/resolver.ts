import { IContext } from '../../../modules';

export default {
    Query: {
        async governmentFinance(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.resources.getGovernmentFinance(args);
        },
        async internationalResources(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.resources.getInternationalResources(args);
        },
        async singleResource(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.resources.getSingleResource(args);
        },
        async printNarratives(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.print.getPrintNarratives(args);
        },
        async recipientODAProfiles(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.recipientProfiles.getRecipientODAProfiles(args);
        },
        async overviewTab(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.tabs.getOverViewTab(args);
        },
        async flows(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.resources.getFlows(args.countryType);
        },
        async populationTab(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.tabs.getPopulationTab(args);
        },
        async povertyTab(_root, args, ctx: IContext) {
            return ctx.modules.countryProfile.tabs.getPovertyTab(args);
        }
    }
};

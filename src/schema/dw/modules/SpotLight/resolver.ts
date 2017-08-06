import {
    IContext
} from '../../../../schema';

export default {
    Query: {
        async educationTabRegional(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getEducationTabRegional(args);
        },
        async healthTabRegional(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getHealthTabRegional(args);
        },
        async localGovernmentFinance(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getLocalGovernmentFinance(args);
        },
        async overviewTabRegional(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getOverViewTabRegional(args);
        },
        async populationTabRegional(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getPopulationTabRegional(args);
        },
        async povertyTabRegional(_root, args, ctx: IContext) {
            return ctx.dw.spotLight.getPovertyTabRegional(args);
        }
    }
};

import { IContext } from '../../../modules';

export default {
    Query: {
        async educationTabRegional(_root, args, ctx: IContext) {
            return ctx.modules.spotLight[args.country].getEducationTabRegional(args);
        },
        async healthTabRegional(_root, args, ctx: IContext) {
            return ctx.modules.spotLight[args.country].getHealthTabRegional(args);
        },
        async localGovernmentFinance(_root, args, ctx: IContext) {
            return ctx.modules.spotLight[args.country].getLocalGovernmentFinance(args);
        },
        async overviewTabRegional(_root, args, ctx: IContext) {
            return ctx.modules.spotLight.getOverViewTabRegional(args);
        },
        async populationTabRegional(_root, args, ctx: IContext) {
            return ctx.modules.spotLight[args.country].getPopulationTabRegional(args);
        },
        async povertyTabRegional(_root, args, ctx: IContext) {
            return ctx.modules.spotLight[args.country].getPovertyTabRegional(args);
        }
    },
    PovertyTabRegional: {
        __resolveType(obj) {
            if (obj.meanExpenditure) {
                return 'PovertyTabKe';
            }
            return 'PovertyTabUg';
        },
    },
    PopulationTabRegional: {
        __resolveType(obj) {
            if (obj.averageDependencyRatio) {
                return 'PopulationTabRegionalUg';
            }
            return 'PopulationTabRegionalKe';
        },
    },
    EducationTabRegional: {
        __resolveType(obj) {
            if (obj.studentsPassRate) {
                return 'EducationTabRegionalUg';
            }
            return 'EducationTabRegionalKe';
        },
    },
    HealthTabRegional: {
        __resolveType(obj) {
            if (obj.districtPerformance) {
                return 'HealthTabRegionalUg';
            }
            return 'HealthTabRegionalKe';
        },
    }
};

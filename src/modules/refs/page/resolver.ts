import {IContext} from '../../../../schema';
export default {
    Query: {
        async countryProfilePageData(_root, _args, ctx: IContext) {
           return ctx.modules.getCountryProfilePageData();
        },
        async districtPageData(_root, args, ctx: IContext) {
            return ctx.modules.getDistrictPageData(args.country);
         },
        async globalPicturePageData(_root, _args, ctx: IContext) {
           return ctx.modules.getGlobalPicturePageData();
        },
        async odaDonorBubbleChartPageData(_root, _args, ctx) {
           return ctx.modules.getOdaDonorBubbleChartPageData();
        },
         async povertyBubbleChartPageData(_root, _args, ctx) {
           return ctx.modules.getPovertyBubbleChartPageData();
        },
        async unbundlingOdaPageData(_root, _args, ctx) {
           return ctx.modules.getUnbundlingOdaPageData();
        },
        async unbundlingOOfPageData(_root, _args, ctx) {
           return ctx.modules.getUnbundlingOOfPageData();
        },
        async whereThePoorPageData(_root, _args, ctx) {
           return ctx.modules.getWhereThePoorPageData();
        }
    }
};

import {IContext} from '../../../../schema';
export default {
    Query: {
        async countryProfilePageData(_root, _args, ctx: IContext) {
           return ctx.cms.getCountryProfilePageData();
        },
        async districtPageData(_root, _args, ctx: IContext) {
            return ctx.cms.getDistrictPageData();
         },
        async globalPicturePageData(_root, _args, ctx: IContext) {
           return ctx.cms.getGlobalPicturePageData();
        },
        async odaDonorBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getOdaDonorBubbleChartPageData();
        },
         async povertyBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getPovertyBubbleChartPageData();
        },
        async unbundlingOdaPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOdaPageData();
        },
        async unbundlingOOfPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOOfPageData();
        },
        async whereThePoorPageData(_root, _args, ctx) {
           return ctx.cms.getWhereThePoorPageData();
        }
    }
};

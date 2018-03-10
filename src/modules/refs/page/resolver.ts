import {IContext} from '../../../modules';
export default {
    Query: {
        async countryProfilePageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getCountryProfilePageData();
        },
        async districtPageData(_root, args, ctx: IContext) {
            return ctx.modules.refs.getDistrictPageData(args.country);
         },
        async globalPicturePageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getGlobalPicturePageData();
        },
        async odaDonorBubbleChartPageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getOdaDonorBubbleChartPageData();
        },
         async povertyBubbleChartPageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getPovertyBubbleChartPageData();
        },
        async unbundlingOdaPageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getUnbundlingOdaPageData();
        },
        async unbundlingOOfPageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getUnbundlingOOfPageData();
        },
        async whereThePoorPageData(_root, _args, ctx: IContext) {
           return ctx.modules.refs.getWhereThePoorPageData();
        },
        async aboutPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getAboutPageData();
         },
         async frontPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getFrontPageData();
         },
         async spotlightGeneralPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getSpotlightGeneralPageData();
         },
         async unbundlingAidPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getUnbundlingAidPageData();
         }
    }
};

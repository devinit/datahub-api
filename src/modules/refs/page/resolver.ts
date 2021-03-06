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
         async spotlightPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getSpotlightPageData();
         },
         async unbundlingAidPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getUnbundlingAidPageData();
         },
         async bubbleChartAnnotationPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getBubbleChartAnnotationPageData();
         },
         async whoAreTheGlobalP20PageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getWhoAreTheGlobalP20PageData();
         },
         async profileHeaderPageData(_root, _args, ctx: IContext) {
            return ctx.modules.refs.getProfileHeaderPageData();
         }
    }
};

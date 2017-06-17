export default {
    Query: {
        async getGlobalPicturePageData(_root, args, ctx) {
           return ctx.cms.getCountryProfilePageData(args.countrySlug);
        }
    }
};

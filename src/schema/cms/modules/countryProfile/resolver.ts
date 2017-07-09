export default {
    Query: {
        async countryProfilePageData(_root, args, ctx) {
           return ctx.cms.getCountryProfilePageData(args.countrySlug);
        }
    }
};

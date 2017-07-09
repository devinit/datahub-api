export default {
    Query: {
        async spotlightUgandaPageData(_root, _args, ctx) {
           return ctx.cms.getSpotlightUgandaPageData();
        }
    }
};

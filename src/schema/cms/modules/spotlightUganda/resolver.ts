export default {
    Query: {
        async getSpotlightUgandaPageData(_root, _args, ctx) {
           return ctx.cms.getSpotlightUgandaPageData();
        }
    }
};

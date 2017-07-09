export default {
    Query: {
        async unbundlingOOfPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOOfPageData();
        }
    }
};

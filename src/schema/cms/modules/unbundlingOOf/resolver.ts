export default {
    Query: {
        async getUnbundlingOOfPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOOfPageData();
        }
    }
};

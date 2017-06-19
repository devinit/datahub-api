export default {
    Query: {
        async getUnbundlingOdaPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOdaPageData();
        }
    }
};

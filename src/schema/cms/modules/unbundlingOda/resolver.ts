export default {
    Query: {
        async unbundlingOdaPageData(_root, _args, ctx) {
           return ctx.cms.getUnbundlingOdaPageData();
        }
    }
};

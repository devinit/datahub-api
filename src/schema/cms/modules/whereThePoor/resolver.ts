export default {
    Query: {
        async getWhereThePoorPageData(_root, _args, ctx) {
           return ctx.cms.getWhereThePoorPageData();
        }
    }
};

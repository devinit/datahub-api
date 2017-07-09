export default {
    Query: {
        async whereThePoorPageData(_root, _args, ctx) {
           return ctx.cms.getWhereThePoorPageData();
        }
    }
};

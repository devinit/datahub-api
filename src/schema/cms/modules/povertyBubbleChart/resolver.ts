export default {
    Query: {
        async getPovertyBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getPovertyBubbleChartPageData();
        }
    }
};

export default {
    Query: {
        async povertyBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getPovertyBubbleChartPageData();
        }
    }
};

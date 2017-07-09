export default {
    Query: {
        async odaDonorBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getOdaDonorBubbleChartPageData();
        }
    }
};

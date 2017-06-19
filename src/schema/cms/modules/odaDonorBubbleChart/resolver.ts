export default {
    Query: {
        async getOdaDonorBubbleChartPageData(_root, _args, ctx) {
           return ctx.cms.getOdaDonorBubbleChartPageData();
        }
    }
};

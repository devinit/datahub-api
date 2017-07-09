export default {
    Query: {
        async getBubbleChartOda(_root, _args, ctx) {
            return ctx.dw.bubbleChart.getBubbleChartOda();
        },
        async getBubbleChartPoverty(_root, _args, ctx) {
            return ctx.dw.bubbleChart.getBubbleChartPoverty();
        },
        async getBubbleSize(_root, args, ctx) {
            return ctx.dw.bubbleChart.getBubbleSize(args);
        },
        async getBubbleChartIndicatorsList(_root, _args, ctx) {
            return ctx.dw.bubbleChart.getBubbleChartIndicatorsList();
        }
    }
};

import {IContext} from '../../../../schema';

export default {
    Query: {
        async bubbleChartOda(_root, _args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartOda();
        },
        async bubbleChartPoverty(_root, _args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartPoverty();
        },
        async bubbleSize(_root, args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleSize(args);
        },
        async bubbleChartIndicatorsList(_root, _args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartIndicatorsList();
        }
    }
};

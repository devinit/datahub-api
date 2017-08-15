import {IContext} from '../../../../schema';

export default {
    Query: {
        async bubbleChartOda(_root, args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartOda(args.id);
        },
        async bubbleChartPoverty(_root, args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartPoverty(args.id);
        },
        async bubbleChartIndicatorsList(_root, _args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartIndicatorsList();
        }
    }
};

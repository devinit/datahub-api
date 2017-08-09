import {IContext} from '../../../../schema';

export default {
    Query: {
        async bubbleChartOda(_root, args, ctx: IContext) {
            const id = args ? args.id : null;
            return ctx.dw.bubbleChart.getBubbleChartOda(id);
        },
        async bubbleChartPoverty(_root, args, ctx: IContext) {
            const id = args ? args.id : null;
            return ctx.dw.bubbleChart.getBubbleChartPoverty(id);
        },
        async bubbleChartIndicatorsList(_root, _args, ctx: IContext) {
            return ctx.dw.bubbleChart.getBubbleChartIndicatorsList();
        }
    }
};

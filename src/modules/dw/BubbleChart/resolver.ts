import {IContext} from '../../../../schema';

export default {
    Query: {
        async bubbleChartOda(_root, args, ctx: IContext) {
            return ctx.modules.bubbleChart.getBubbleChartOda(args.id);
        },
        async bubbleChartPoverty(_root, args, ctx: IContext) {
            return ctx.modules.bubbleChart.getBubbleChartPoverty(args.id);
        },
        async bubbleChartOptions(_root, _args, ctx: IContext) {
            return ctx.modules.bubbleChart.getBubbleChartOptions();
        }
    }
};

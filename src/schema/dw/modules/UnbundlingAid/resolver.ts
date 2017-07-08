export default {
    Query: {
        async getUnbundlingAidData(_root, {args}, ctx) {
            return ctx.dw.unbundlingAid.getUnbundlingAidData(args);
        },
        async getUnbundlingSelectionData(_root, args, ctx) {
            console.log('selection option', args);
            return ctx.dw.unbundlingAid.getUnbundlingSelectionData(args);
        }
    }
};

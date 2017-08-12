export default {
    Query: {
        async unbundlingAidData(_root, {args}, ctx) {
            return ctx.dw.unbundlingAid.getUnbundlingAidData(args);
        },
        async UnbundlingAidToTalQuery(_root, {args}, ctx) {
            return ctx.dw.unbundlingAid.getUnbundlingAidDataTotal(args);
        },
        async unbundlingSelectionData(_root, args, ctx) {
            return ctx.dw.unbundlingAid.getUnbundlingSelectionData(args);
        }
    }
};

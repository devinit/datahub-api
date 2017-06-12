export default {
    Query: {
        async getMapData(_root, args, ctx) {
           return ctx.dw.maps.getMapData(args);
        }
    }
};

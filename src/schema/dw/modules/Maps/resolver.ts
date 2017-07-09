export default {
    Query: {
        async mapData(_root, args, ctx) {
           return ctx.dw.maps.getMapData(args);
        }
    }
};

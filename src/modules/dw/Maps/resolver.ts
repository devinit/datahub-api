export default {
    Query: {
        async mapData(_root, args, ctx) {
           return ctx.modules.maps.getMapData(args.id);
        }
    }
};

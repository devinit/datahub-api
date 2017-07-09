export default {
    Query: {
        async globalPicturePageData(_root, _args, ctx) {
           return ctx.cms.getGlobalPicturePageData();
        },
        async globalPictureThemes(_root, _args, ctx) {
           return ctx.cms.getGlobalPictureThemes();
        }
    }
};

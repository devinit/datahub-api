export default {
    Query: {
        async getGlobalPicturePageData(_root, _args, ctx) {
           return ctx.cms.getGlobalPicturePageData();
        },
        async getGlobalPictureThemes(_root, _args, ctx) {
           return ctx.cms.getGlobalPictureThemes();
        }
    }
};

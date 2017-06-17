export default {
    Query: {
        async getGlobalPicturePageData(_root, _args, ctx) {
           return ctx.cms.getGlobalPicturePageData();
        }
    }
};

module.exports = {
    Query: {
        async apiName(_root, _args, ctx) {
            return ctx.modules.apiName.name; // could be a function
         }
    }
};

import model from './model';

export default {
  Query: {
    getPerson(root, args, ctx) {
      return model.findPerson(model.persons, args.id);
    },
    persons(root, args, ctx) {
      return ctx.persons;
    }
  },
  Mutation: {
    addPerson(root, args, ctx) {
      return model.addPerson(model.persons, {
        id: Math.random().toString(16).substr(2),
        name: args.name,
        sex: args.sex
      });
    },
  },
};

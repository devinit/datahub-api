import model from './model';

export default {
  Query: {
    getPerson(root, args, ctx) {
      return model.findPerson(model.persons, args.id);
    },
    persons(root, args, ctx) {
      return model.persons;
    },
    getPersonWithExtra(root, args, ctx) {
      const tempPerson = {
        id: '2',
        sex: 'female',
        name: 'lala'
      };
      return {
        speed: 1,
        person: tempPerson
      };
    },
  },
  Extra: {
    agility(root, args) {
      console.log('root: ', root);
      if (root.person.sex === 'female') return { value: 5 + args.height };
      return { value: 1 + args.height };
    },
  },
  Mutation: {
    addPerson(root, args, ctx) {
      return model.addPerson(model.persons, {
        id: Math.random().toString(16).substr(2),
        name: args.name,
        sex: args.sex,
        __type: 'person'
      });
    },
  },
};
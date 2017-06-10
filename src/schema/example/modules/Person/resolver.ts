import model from './model';

export default {
  Query: {
    getPerson(_root, args) {
      return model.findPerson(model.persons, args.id);
    },
    persons() {
      return model.persons;
    },
    getPersonWithExtra() {
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
    addPerson(_root, args) {
      return model.addPerson(model.persons, {
        id: Math.random().toString(16).substr(2),
        name: args.name,
        sex: args.sex
      });
    },
  },
};

const persons = [
  {
    id: '1',
    sex: 'male',
    name: 'miro'
  },
  {
    id: '2',
    sex: 'female',
    name: 'lala'
  },
  {
    id: '3',
    sex: 'male',
    name: 'joe'
  }
];

const findPerson = (personsArr: any[], id: string) => {
  return personsArr.find(person => person.id === id);
};

const addPerson = (personsArr: any[], person: any) => {
  personsArr.push(person);
  return personsArr;
};

export default {
  persons,
  findPerson,
  addPerson
};

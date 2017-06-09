const persons: DH.IPersonType[] = [
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

const findPerson = (personsArr: DH.IPersonType[], id: string): DH.IPersonType => {
  return personsArr.find((person) => person.id === id);
};

const addPerson = (personsArr: DH.IPersonType[], person: DH.IPersonType) => {
  personsArr.push(person);
  return personsArr;
};

export default {
  persons,
  findPerson,
  addPerson
};

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

interface IPerson {
  id: string;
  sex: string;
  name: string;
}

const findPerson = (personsArr: any[], id: string) => {
  return personsArr.find((person) => person.id === id);
};

const addPerson = (personsArr: any[], person) => {
  personsArr.push(person);
  return personsArr;
};

export default {
  persons,
  findPerson,
  addPerson
};

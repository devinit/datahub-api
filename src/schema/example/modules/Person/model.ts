const persons: DHschema.IPersonType[] = [
  {
    __typename: 'person',
    id: '1',
    sex: 'male',
    name: 'miro'
  },
  {
    __typename: 'person',
    id: '2',
    sex: 'female',
    name: 'lala'
  },
  {
     __typename: 'person',
    id: '3',
    sex: 'male',
    name: 'joe'
  }
];


const findPerson = (personsArr: DHschema.IPersonType[], id: string): DHschema.IPersonType => {
  return personsArr.find((person) => person.id === id);
};

const addPerson = (personsArr: DHschema.IPersonType[], person: DHschema.IPersonType) => {
  personsArr.push(person);
  return personsArr;
};

export default {
  persons,
  findPerson,
  addPerson
};

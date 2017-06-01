export default `
  type PersonType {
    name: String
    id: String
    sex: String
  }

  type Query {
    getPerson(id: String!): PersonType
    persons: [PersonType]
  }

  type Mutation {
      addPerson(name: String!, sex: String!): PersonType
  }
`;

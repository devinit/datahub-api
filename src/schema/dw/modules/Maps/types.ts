export default `
  type Map {
    # country code Id
    id: String
    year: Int
    value: Int
  }

  type Query {
    getMapData(
      # map indicator type eg poverty
      type: String!,
      startYear: Int,
      endYear: Int): [Map]
  }
`;

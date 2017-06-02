export default `
  type OverViewTab {
    poorestPeople: Int
    population: Int
    domesticPublicResources: Int
    internationalResources: Int
    governmentSpendPerPerson: Int
  }
  
  type IndicatorData {
    year: Int
    Value: Int
  }

  type PovertyTab {
    poverty190Trend : [IndicatorData]
    depthOfExtremePoverty: Int
    quintileIncomeDistBarChart: [IndicatorData]

  }
   type PopulationPovertyInd {
    Population: Int
    year: Int
  }
  type PopulationTabDonor {
    population: Int
  }
  type PopulationTabRecipient {
    population: Int
    Urban: [type PopulationInd]
    Rural: [type PopulationInd]
  }
  type PopulationPerAge {
    age:[]
    population: Int
    year: Int
  }


  type Query {
    
    getOverViewTab(country: String!): OverViewTab

    getPovertyTab(country: String): PovertyTab

    getPopulationTabDonors(country: Sting): PopulationTabDonor

    getPopulationTabRecipients(country: Sting): PopulationTabRecipient
  }
`;

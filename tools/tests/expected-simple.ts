// tslint:disable
export default  `
schema {
    query: Query
}
type Query {
    clients: [Client] products: [Product]
}
type Client {
    id: Int!name: String age: Int
}
type Product {
    id: Int!description: String price: Int
}`;

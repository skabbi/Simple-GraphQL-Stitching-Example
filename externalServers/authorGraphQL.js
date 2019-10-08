const { authors, books, reviews } = require('../utils/mock.js');;
const { ApolloServer, gql } = require('apollo-server');


let typeDefs = gql `
  type Query {
    authors: [Author]
    author(id: ID!): Author
  }

  type Author {
    id: ID!,
    name: String
  }
`;

let resolvers = {
  Query: {
    author: (_, args) => {
      return authors.find(a => a.id === args.id);
    },
    authors: () => {
      return authors;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(3001).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
const { authors, books, reviews } = require('../utils/mock.js');;
const { ApolloServer, gql } = require('apollo-server');


let typeDefs = gql `
  type Query {
    books: [Book]
    booksByAuthorId(authorId: ID!): [Book]
  }

  type Book {
    id: ID!,
    authorId: ID!,
    title: String,
    review: Float
  }
`;

let resolvers = {
  Query: {
    booksByAuthorId: (_, args) => {
      return books.filter(b => b.authorId == args.authorId);
    },
    books: () => {
      return books;
    }
  },

  Book: {
    title: (book) => {
      return book.title;
    },
    review: (book) => {
      console.log('review:', book);
      console.log("----");
      return reviews.find(r => r.bookId === book.id).review;
    },
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(3002).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
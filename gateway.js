const { ApolloServer, gql } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const {
  mergeSchemas,
  transformSchema,
  FilterRootFields,
  RenameRootFields,
  RenameTypes
} = require('graphql-tools');

const getAuthorSchema = require('./schemaLinks/author.js');
const getBookSchema = require('./schemaLinks/book.js');

/*
  Since we have access to 'Author' and 'Book' via schema stitching.
  We can extend the 'Author' to include 'books' field.
*/
let linkTypeDefs = gql `
  extend type Author {
    books: [Book]
  }
`;

async function startServer() {

  const authorSchema = await getAuthorSchema();
  const bookSchema = await getBookSchema();

  /*
    New resolver that will be merged with the external schemas
  */
  const resolvers = {
    Author: {
      books: {
        fragment: `... on Author { id }`, // Implicity get the Author ID
        resolve(author, args, context, info) {
          return info.mergeInfo.delegateToSchema({
            schema: bookSchema,
            operation: 'query',
            fieldName: 'booksByAuthorId',
            args: {
              authorId: author.id
            },
            context,
            info
          });
        }
      }
    }
  };

  /*
    We can transform the external schemas we intend to expose.
    E.g. be removing or renaming fields
  */
  const transformedBookSchema = transformSchema(bookSchema, [
    // Renmoving 'books query'
    new FilterRootFields((operation, rootField) => { return rootField !== 'books' }),
    // Adding 'BOOK_' prefix to remaning queries
    new RenameRootFields((operation, name) => `BOOK_${name}`)
  ]);

  const schema = mergeSchemas({
    schemas: [
      authorSchema,
      transformedBookSchema,
      linkTypeDefs
    ],
    resolvers
  });

  const server = new ApolloServer({ resolvers, schema });
  return await server.listen(3000);
}

startServer().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
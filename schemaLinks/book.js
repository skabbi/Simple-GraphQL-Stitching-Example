const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');

const link = new HttpLink({ uri: 'http://localhost:3002/', fetch });

const bookSchema = async () => {
  const schema = await introspectSchema(link);

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

  return executableSchema
}

module.exports = bookSchema;
# Simple-GraphQL-Stitching-Example
Simple example of stitching together schema from two different GraphQL servers

This example will stitch together an `Author` and `Book` GraphQL services
and extend the `Author` type to add the ability to get information about book by
the author.

Additionally, we will do some basic transformation to the `Book` service to remove and rename
root level queries.

To start up the servers, run
```
$ node externalServers/authorGraphQL.js
=> Server ready at http://localhost:3001/
$ node externalServers/bookGraphQL.js
=> Server ready at http://localhost:3002/
$ node gateway.js
=> Server ready at http://localhost:3000/
```

Then in your browser:
&nbsp;&nbsp;&nbsp;&nbsp; the URL "http://localhost:3000/" will show you a GraphQL client for the gateway.
&nbsp;&nbsp;&nbsp;&nbsp; the URL "http://localhost:3001/" will show you a GraphQL client for the Author service
&nbsp;&nbsp;&nbsp;&nbsp; the URL "http://localhost:3002/" will show you a GraphQL client for the Book service

The gateway allows you to get information about authors and book in a single query,
even though the Author and Book services do now offer information about each other.

**Example gateway request:**
```
{
  authors {
    name
    books {
      title
      review
    }
  }
}

```

**Example gateway response:**
```
{
  "data": {
    "authors": [
      {
        "name": "J.K. Rowling",
        "books": [
          {
            "title": "Harry Potter and the Chamber of Secrets"
          },
          {
            "title": "Fantastic Beasts and Where to Find Them"
          },
          {
            "title": "The Casual Vacancy"
          }
        ]
      },
      ...
```
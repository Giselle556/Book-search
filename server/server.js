const express = require('express');
const path = require('path');
const db = require('./config/connection');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
// integrate our Apollo server with the Express application as middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
server.start()
  .then(() => {
    server.applyMiddleware({ app });

    // Serve up static assets
   if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
   }

   app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
   });
    db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
  });
  })
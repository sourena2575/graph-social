const { importSchema } = require("graphql-import");
const { ApolloServer, PubSub } = require("apollo-server");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");

const port = process.env.PORT || 5000;
const uri = config.get("mdb");
const pubsub = new PubSub();
// graphql server
const typeDefs = importSchema(path.join(__dirname, `./Graphql/index.graphql`));
const resolvers = require("./Graphql/index");
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});
// start server
mongoose
  .connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return server.listen({ port });
  })
  .then((res) => {
    console.log(`server on ${res.url} connected to MDB`);
  })
  .catch((er) => {
    console.error(er);
  });

import * as functions from "firebase-functions";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import * as admin from "firebase-admin";
// import Roomba from "./Roomba";

// const db = admin.firestore();

const app = express();

admin.initializeApp();

const schema = buildSchema(`
  type Query {
    traverseString(input: String): String
  }
`);

const root = {
  traverseString({ input }: { input: string }) {
    return input;
  },
};

app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

exports.roombas = functions.https.onRequest(app);

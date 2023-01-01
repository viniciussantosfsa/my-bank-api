import { GraphQLSchema, GraphQLObjectType } from "graphql";
import accountQuery from "./queries/account.query.js";

const Schema = new GraphQLSchema({
  types: null,
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      ...accountQuery,
    },
  }),
  mutation: null,
});

export default Schema;

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core/index.js";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.chargetrip.io/graphql",
    headers: {
      "x-client-id": process.env.GRAPHQL_CLIENT_KEY,
      "x-app-id": process.env.GRAPHQL_APP_KEY,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
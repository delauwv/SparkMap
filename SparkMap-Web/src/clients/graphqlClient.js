import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core/index.js";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.chargetrip.io/graphql",
    headers: {
      "x-client-id": "67a6085b8c98b467af96e1d5",
      "x-app-id": "67a6085b8c98b467af96e1d7",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
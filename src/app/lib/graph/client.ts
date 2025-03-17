import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const lucidityClient = new ApolloClient({
  link: new HttpLink({
    uri: `https://api.studio.thegraph.com/query/37770/lucidity/version/latest`,
  }),
  cache: new InMemoryCache(),
});


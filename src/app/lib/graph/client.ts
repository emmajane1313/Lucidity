import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const lucidityClient = new ApolloClient({
  link: new HttpLink({
    uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/E8AWp1HBjHbEDvJMuCpHFcSfz8vmV7Z8fAjALGob2HNk`,
  }),
  cache: new InMemoryCache(),
});


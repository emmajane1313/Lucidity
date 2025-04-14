import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const lucidityClient = new ApolloClient({
  link: new HttpLink({
    uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/69Y3tNegVngQu4V89UotXB8Z7fPC3TLsPnCVWWvhQpF5`,
  }),
  cache: new InMemoryCache(),
});


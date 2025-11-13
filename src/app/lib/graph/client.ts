import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getLucidityUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/lucidity`;
  }
  return "/api/graphql/lucidity";
};

const httpLinkLucidity = new HttpLink({
  uri: getLucidityUri(),
});

export const lucidityClient = new ApolloClient({
  link: httpLinkLucidity,

  cache: new InMemoryCache(),
});

import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import guardRequest from "@/app/lib/helpers/guardRequest";
import validateGraphQuery from "@/app/lib/helpers/validateGraphQuery";
import { RATE_LIMIT_GRAPHQL } from "@/app/lib/constants";

const serverLucidityClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPH_NODE_URL,
  }),
  cache: new InMemoryCache(),
});

export async function POST(request: NextRequest) {
  try {
    const blocked = guardRequest(
      request,
      "graphql-lucidity",
      RATE_LIMIT_GRAPHQL
    );
    if (blocked) return blocked;

    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const invalid = validateGraphQuery(query);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const result = await serverLucidityClient.query({
      query: gql(query),
      variables: variables || {},
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error?.message);
    return NextResponse.json(
      { error: "GraphQL query failed" },
      { status: 500 }
    );
  }
}

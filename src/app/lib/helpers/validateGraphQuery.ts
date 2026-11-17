import { gql } from "@apollo/client";
import { MAX_GRAPH_QUERY_LENGTH } from "../constants";

const validateGraphQuery = (query: unknown): string | undefined => {
  if (typeof query !== "string") {
    return "Query must be a string";
  }

  if (query.length > MAX_GRAPH_QUERY_LENGTH) {
    return "Query is too long";
  }

  if (/__schema\b|__type\b/.test(query)) {
    return "Introspection is not allowed";
  }

  const document = gql(query);
  const forbidden = document.definitions.some(
    (definition) =>
      definition.kind === "OperationDefinition" &&
      definition.operation !== "query"
  );

  if (forbidden) {
    return "Only query operations are allowed";
  }

  return undefined;
};

export default validateGraphQuery;

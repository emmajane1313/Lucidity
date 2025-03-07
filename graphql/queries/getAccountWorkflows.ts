import { lucidityClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const ACCOUNT_WORKFLOWS = gql`
  query ($creator: String!, $skip: Int!) {
    workflowCreateds(where: { creator: $creator }, first: 20, skip: $skip) {
      workflowMetadata {
        workflow
        tags
        name
        description
        setup
        links
      }
      creator
      uri
      counter
    }
  }
`;

export const getAccountWorkflows = async (
  creator: string,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = lucidityClient.query({
    query: ACCOUNT_WORKFLOWS,
    variables: { creator, skip },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);

  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

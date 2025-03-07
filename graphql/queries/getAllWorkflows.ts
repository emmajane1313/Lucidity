import { lucidityClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const ALL_WORKFLOWS = gql`
  query ($skip: Int!) {
    workflowCreateds(
      first: 20
      skip: $skip
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
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

export const getAllWorkflows = async (
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = lucidityClient.query({
    query: ALL_WORKFLOWS,
    variables: { skip },
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

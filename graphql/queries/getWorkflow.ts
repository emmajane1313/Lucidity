import { lucidityClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const WORKFLOW = gql`
  query ($counter: Int!) {
    workflowCreateds(first: 1, where: { counter: $counter }) {
      workflowMetadata {
        workflow
        tags
        name
        description
        setup
      }
      creator
      uri
      counter
    }
  }
`;

export const getWorkflow = async (
  counter: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = lucidityClient.query({
    query: WORKFLOW,
    variables: { counter },
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

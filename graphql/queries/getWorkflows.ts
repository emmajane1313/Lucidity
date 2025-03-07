import { lucidityClient } from "@/app/lib/graph/client";
import serializeQuery from "@/app/lib/helpers/serializeQuery";
import { FetchResult, gql } from "@apollo/client";

export const getWorkflows = async (
  where: object
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = lucidityClient.query({
    query: gql(`
      query {
        workflowCreateds(where: {${serializeQuery(where)}}) {
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
    `),
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

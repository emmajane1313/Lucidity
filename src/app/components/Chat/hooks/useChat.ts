import { SetStateAction, useEffect, useRef, useState } from "react";
import { Mensaje, Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import OpenAI from "openai";
import { getWorkflows } from "../../../../../graphql/queries/getWorkflows";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { GREY_BEARD, INSTRUCTIONS, STORAGE_NODE } from "@/app/lib/constants";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";

const useChat = (
  openAI: OpenAI,
  setOpenAI: (e: SetStateAction<OpenAI | undefined>) => void,
  setMensajes: (e: SetStateAction<Mensaje[]>) => void,
  mensajes: Mensaje[],
  lensConnected: LensConnected,
  lensClient: PublicClient,
  assistant: OpenAI.Beta.Assistants.Assistant & {
    _request_id?: string | null;
  },
  setAssistant: (
    e: SetStateAction<
      | (OpenAI.Beta.Assistants.Assistant & {
          _request_id?: string | null;
        })
      | undefined
    >
  ) => void,
  thread: OpenAI.Beta.Threads.Thread & {
    _request_id?: string | null;
  },
  setThread: (
    e: SetStateAction<
      | (OpenAI.Beta.Threads.Thread & {
          _request_id?: string | null;
        })
      | undefined
    >
  ) => void
) => {
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [typed, setTyped] = useState<boolean>(true);
  const [typedMessage, setTypedMessage] = useState("");
  const profileCache = new Map<string, Account>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleRun = async (
    run: OpenAI.Beta.Threads.Runs.Run
  ): Promise<
    | {
        messages: OpenAI.Beta.Threads.Messages.Message[];
        output: {
          name: string;
          output: string;
        }[];
      }
    | undefined
  > => {
    let tool_output: {
      name: string;
      output: string;
    }[] = [];
    while (true) {
      const runRetrieved = await openAI.beta.threads.runs.retrieve(
        run.thread_id,
        run.id
      );
      let status = runRetrieved.status;

      if (status === "requires_action") {
        const requiredActions =
          runRetrieved?.required_action?.submit_tool_outputs.tool_calls;

        if (requiredActions) {
          let toolsOutput: {
            tool_call_id: string;
            output: string;
          }[] = [];
          for (const action of requiredActions) {
            const funcName = action.function.name;
            const functionArguments = JSON.parse(action.function.arguments);

            if (funcName === "getWorkflowsTool") {
              try {
                const output = await getWorkflowsTool(functionArguments);
                toolsOutput.push({
                  tool_call_id: action.id,
                  output: JSON.stringify(
                    JSON.parse(output).map(
                      (item: any) => item?.workflowMetadata?.name
                    )
                  ),
                });
                tool_output.push({
                  name: "GET_WORKFLOWS",
                  output: output,
                });
              } catch (error) {
                console.error(`Error executing function ${funcName}: ${error}`);
              }
            } else {
              console.error("Function not found");
              break;
            }
          }

          if (toolsOutput.length > 0) {
            await openAI.beta.threads.runs.submitToolOutputs(
              run.thread_id,
              run.id,
              {
                tool_outputs: toolsOutput,
              }
            );
          }
        }
      } else if (status === "completed") {
        let messages = await openAI.beta.threads.messages.list(run.thread_id);
        return {
          messages: messages.data,
          output: tool_output,
        };
      } else if (status === "failed" || status === "cancelled") {
        console.error("Run failed or was cancelled.");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleSendMessage = async (
    mensajes: {
      contenido: string;
      usuario: Usuario;
      flujos?: Flujo[];
      flujo?: object;
      action?: string;
    }[]
  ) => {
    let internal_prompt = prompt;
    setPrompt("");
    setTypedMessage("");
    if (internal_prompt?.trim() == "" || !assistant) return;
    setSendMessageLoading(true);
    try {
      let hilo = thread;
      if (mensajes.length == 1 && !hilo) {
        hilo = await openAI.beta.threads.create();
        setThread(hilo);
      }

      if (!hilo) {
        setSendMessageLoading(false);
        return;
      }

      setTyped(false);

      await openAI.beta.threads.messages.create(hilo!?.id, {
        role: "user",
        content: internal_prompt,
      });

      let run = await openAI.beta.threads.runs.createAndPoll(hilo!?.id, {
        assistant_id: assistant!?.id,
      });

      const res = await handleRun(run);

      if (res) {
        setMensajes([
          ...mensajes?.filter(
            (mensaje) => mensaje !== undefined && mensaje !== null
          ),
          {
            contenido: `${
              !mensajes?.find(
                (men) =>
                  men.contenido ==
                  (res?.messages?.[1]?.content?.[0] as TextContentBlock)?.text
                    ?.value
              ) &&
              (res?.messages?.[1]?.content?.[0] as TextContentBlock)?.text
                ?.value
                ? `${
                    (res?.messages?.[1]?.content?.[0] as TextContentBlock)?.text
                      ?.value
                  }\n\n`
                : ""
            }${
              (res?.messages?.[0]?.content?.[0] as TextContentBlock)?.text
                ?.value ?? ""
            }`,
            usuario: Usuario.Maquina,
            action: res?.output?.[0]?.name,
          },
          res?.output?.[0]?.output &&
            ({
              usuario: Usuario.Flujos,
              flujos: (await Promise.all(
                JSON.parse(res?.output?.[0]?.output).map(
                  async (item: {
                    creator: string;
                    counter: string;
                    workflowMetadata: {
                      workflow: string;
                      name: string;
                      tags: string;
                      description: string;
                      cover: string;
                      setup: string;
                      links: string[];
                    };
                  }) => {
                    if (item.workflowMetadata?.workflow) {
                      if (
                        !profileCache.get(item?.creator) &&
                        (lensClient || lensConnected?.sessionClient)
                      ) {
                        const result = await fetchAccountsAvailable(
                          lensConnected?.sessionClient ?? lensClient,
                          {
                            managedBy: evmAddress(item?.creator),
                            includeOwned: true,
                          }
                        );

                        if (result.isOk()) {
                          const profile = result?.value.items[0]
                            ?.account as Account;
                          let picture = "";
                          if (profile?.metadata?.picture) {
                            const pictureKey =
                              profile.metadata.picture.split("lens://")?.[1];
                            const cadena = await fetch(
                              `${STORAGE_NODE}/${pictureKey}`
                            );
                            const json = await cadena.json();
                            picture = json.item;
                          }

                          profileCache.set(item?.creator, {
                            ...profile,
                            metadata: {
                              ...profile?.metadata!,
                              picture,
                            },
                          });
                        }
                      }

                      return {
                        creator: item.creator,
                        counter: item.counter,
                        tags: item.workflowMetadata?.tags?.split(", "),
                        name: item.workflowMetadata?.name,
                        description: item.workflowMetadata?.description,
                        cover: item.workflowMetadata?.cover,
                        workflow: JSON.parse(item.workflowMetadata?.workflow),
                        setup: item?.workflowMetadata?.setup?.split(", "),
                        links: item?.workflowMetadata?.links,
                        profile: profileCache.get(item?.creator),
                      };
                    }
                    return item;
                  }
                )
              )) as Flujo[],
            } as any),
        ]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSendMessageLoading(false);
  };

  const createAssistant = async () => {
    try {
      const open_assistant = await openAI.beta.assistants.create({
        name: "Pixel",
        instructions: GREY_BEARD,
        model: "gpt-4o-mini",
        tools: [
          {
            type: "function",
            function: {
              name: "getWorkflowsTool",
              parameters: {
                type: "object",
                properties: {
                  search: {
                    type: "string",
                    description:
                      "1-5 key search terms i.e. segmentation mask filter",
                  },
                },
                required: ["search"],
              },
              description: INSTRUCTIONS,
            },
          },
        ],
      });
      setAssistant(open_assistant);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getWorkflowsTool = async (params: { search: string }) => {
    try {
      const searchTerms = params?.search.split(" ").filter(Boolean);
      const orConditions = searchTerms.flatMap((term) => [
        { description_contains_nocase: term },
        { name_contains_nocase: term },
        { tags_contains_nocase: term },
        { workflow_contains_nocase: term },
      ]);

      const result = await getWorkflows({
        workflowMetadata_: {
          or: orConditions,
        },
      });

      return JSON.stringify(result?.data?.workflowCreateds, null, 2);
    } catch (error) {
      console.error("API Error:", error);

      throw error;
    }
  };

  useEffect(() => {
    if (!openAI) {
      setOpenAI(
        new OpenAI({
          apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
          dangerouslyAllowBrowser: true,
        })
      );
    }

    if (!assistant && openAI) {
      createAssistant();
    }
  }, [openAI]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (mensajes) {
      const mensajesLimpiados = (mensajes || [])?.filter(
        (mensaje) => mensaje !== undefined && mensaje !== null
      );

      if (
        mensajesLimpiados?.length > 0 &&
        mensajesLimpiados[mensajesLimpiados?.length - 1]?.usuario ==
          Usuario.Maquina &&
        mensajesLimpiados[mensajesLimpiados?.length - 1]?.contenido &&
        typedMessage.trim() == ""
      ) {
        const ultimoMensaje =
          mensajesLimpiados[mensajesLimpiados?.length - 1]?.contenido;
        let i: number = 0;
        let mensajeEscribiendo = "";

        const interval = setInterval(() => {
          if (i < ultimoMensaje.length) {
            mensajeEscribiendo += ultimoMensaje[i];
            setTypedMessage(mensajeEscribiendo);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 30);

        setTypedMessage("");
        setTyped(true);
        return () => clearInterval(interval);
      }
    }
  }, [mensajes]);

  return {
    prompt,
    setPrompt,
    handleSendMessage,
    sendMessageLoading,
    messagesEndRef,
    typedMessage,
    typed,
  };
};

export default useChat;

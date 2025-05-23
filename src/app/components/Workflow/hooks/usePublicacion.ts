import {
  PageSize,
  Post,
  PostReferenceType,
  PublicClient,
} from "@lens-protocol/client";
import { LensConnected } from "../../Common/types/common.types";
import { SetStateAction, useEffect, useState } from "react";
import {
  post as createPost,
  enablePostAction,
  fetchPostReferences,
  fetchPosts,
} from "@lens-protocol/client/actions";
import pollResult from "@/app/lib/helpers/pollResult";
import { Flujo } from "../../Modals/types/modals.types";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import {
  image,
  MediaImageMimeType,
  MediaVideoMimeType,
  textOnly,
  video,
} from "@lens-protocol/metadata";

const usePublicacion = (
  lensClient: PublicClient,
  lensConnected: LensConnected,
  storageClient: StorageClient,
  setError: (e: SetStateAction<string | undefined>) => void,
  setSignless: (e: SetStateAction<boolean>) => void,
  flujo: Flujo | undefined,
  dict: any
) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [post, setPost] = useState<Post | undefined>();
  const [texto, setTexto] = useState<string>("");
  const [comments, setComments] = useState<Post[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<{
    hasMore: boolean;
    paginated?: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });

  const handleComment = async () => {
    if (!post) return;
    setPostLoading(true);
    try {
      const acl = immutable(chains.mainnet.id);
      const schema = textOnly({
        content: texto,
      });
      const { uri } = await storageClient?.uploadAsJson(schema, { acl })!;
      const res = await createPost(lensConnected?.sessionClient!, {
        contentUri: uri,
        commentOn: {
          post: post?.id,
        },
      });

      if (res.isErr()) {
        setError?.(dict.Home.error);
        setPostLoading(false);
        return;
      }

      if (
        (res.value as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res.value as any)?.hash) {
        if (
          await pollResult(
            (res.value as any)?.hash,
            lensConnected?.sessionClient!
          )
        ) {
          setSuccess(true);
          setTexto("");
          await handleComments();
        } else {
          setError?.(dict.Home.error);
        }
      } else {
        setError?.(dict.Home.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handlePost = async () => {
    if (texto?.trim() == "n7bnpkh8t50bh6qs0m" || post?.id) return;
    setPostLoading(true);
    try {
      const acl = immutable(chains.mainnet.id);

      const schema = image({
        content: `${texto}\n\nhttps://lucidity.agentmeme.xyz/en/workflow/${flujo?.counter}/`,
        image: {
          item: flujo?.cover as string,
          type: MediaImageMimeType.PNG,
        },
        tags: ["lucidity", flujo?.name, flujo?.counter]?.filter(
          Boolean
        ) as string[],
      });

      const { uri } = await storageClient?.uploadAsJson(schema, { acl })!;

      const res = await createPost(lensConnected?.sessionClient!, {
        contentUri: uri,
      });

      if (res.isErr()) {
        setError?.(dict.Home.error);
        setPostLoading(false);
        return;
      }
      if (
        (res.value as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res.value as any)?.hash) {
        if (
          await pollResult(
            (res.value as any)?.hash,
            lensConnected?.sessionClient!
          )
        ) {
          setSuccess(true);
          setTexto("");
          await handleFindThread();
        } else {
          setError?.(dict.Home.error);
        }
      } else {
        setError?.(dict.Home.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleComments = async () => {
    if (!post) return;
    setCommentsLoading(true);
    try {
      const data = await fetchPostReferences(
        lensConnected?.sessionClient ?? lensClient,
        {
          pageSize: PageSize.Ten,
          referencedPost: post?.id,
          referenceTypes: [PostReferenceType.CommentOn],
        }
      );
      if (!data?.isOk()) {
        setCommentsLoading(false);
        return;
      }
      setHasMore({
        hasMore: data?.value?.items?.length == 10,
        paginated: data?.value?.pageInfo?.next!,
      });
      setComments(data?.value?.items as Post[]);
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const handleMoreComments = async () => {
    if (!post) return;
    setCommentsLoading(true);
    try {
      const data = await fetchPostReferences(
        lensConnected?.sessionClient ?? lensClient,
        {
          pageSize: PageSize.Ten,
          referencedPost: post?.id,
          referenceTypes: [PostReferenceType.CommentOn],
          cursor: hasMore?.paginated,
        }
      );
      if (!data?.isOk()) {
        setCommentsLoading(false);
        return;
      }
      setHasMore({
        hasMore: data?.value?.items?.length == 10,
        paginated: data?.value?.pageInfo?.next!,
      });
      setComments([...comments, ...(data?.value?.items as Post[])]);
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const handleFindThread = async () => {
    if (!flujo) return;
    setPostLoading(true);
    try {
      const data = await fetchPosts(
        lensConnected?.sessionClient ?? lensClient,
        {
          filter: {
            metadata: {
              tags: {
                all: ["lucidity"],
                // all: ["lucidity", flujo?.name, flujo?.counter],
              },
            },
          },
        }
      );

      if (data.isErr()) {
        setPostLoading(false);
        return;
      }

      setPost(data?.value?.items?.[0] as Post);
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  useEffect(() => {
    if (!post && flujo) {
      handleFindThread();
    }
  }, [flujo]);

  useEffect(() => {
    if (post && flujo) {
      handleComments();
    }
  }, [flujo, post]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [success]);

  return {
    handlePost,
    postLoading,
    post,
    texto,
    setTexto,
    success,
    comments,
    commentsLoading,
    handleMoreComments,
    hasMore,
    handleComment,
  };
};

export default usePublicacion;

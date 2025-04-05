import { MainContentFocus, Post } from "@lens-protocol/client";
import { LensConnected } from "../../Common/types/common.types";
import { SetStateAction, useEffect, useState } from "react";
import {
  addReaction,
  repost,
  post as createPost,
} from "@lens-protocol/client/actions";
import pollResult from "@/app/lib/helpers/pollResult";
import { v4 as uuidv4 } from "uuid";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { textOnly } from "@lens-protocol/metadata";

const useInteraccion = (
  lensConnected: LensConnected,
  setError: (e: SetStateAction<string | undefined>) => void,
  setSignless: (e: SetStateAction<boolean>) => void,
  post: Post | undefined,
  storageClient: StorageClient,
  dict: any
) => {
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [texto, setTexto] = useState<string>("");
  const [interactionLoading, setInteractionLoading] = useState<{
    mirror: boolean;
    like: boolean;
    comment: boolean;
  }>({
    mirror: false,
    like: false,
    comment: false,
  });
  const [interactions, setInteractions] = useState<{
    upvotes: number;
    hasUpvoted: boolean;
    reposts: number;
    hasReposted: boolean;
    hasCommented: boolean;
    comments: number;
  }>({
    upvotes: 0,
    hasUpvoted: false,
    reposts: 0,
    hasReposted: false,
    hasCommented: false,
    comments: 0,
  });

  const handleLike = async (id: string, reaction: string) => {
    setInteractionLoading({
      ...interactionLoading,
      like: true,
    });
    try {
      const res = await addReaction(lensConnected?.sessionClient!, {
        post: id,
        reaction,
      });

      if (res.isOk()) {
        if (
          (res.value as any)?.reason?.includes(
            "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
          )
        ) {
          setSignless?.(true);
        } else if ((res.value as any)?.success) {
          setInteractions?.({
            ...interactions,
            upvotes:
              reaction == "UPVOTE"
                ? Number(post?.stats?.upvotes) + 1
                : Number(post?.stats?.upvotes) - 1,
            hasUpvoted: reaction == "UPVOTE" ? true : false,
          });
        } else {
          setError?.(dict.Home.error);
        }
      } else {
        setError?.(dict.Home.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionLoading({
      ...interactionLoading,
      like: false,
    });
  };

  const handleMirror = async (id: string) => {
    setInteractionLoading({
      ...interactionLoading,
      mirror: true,
    });
    try {
      const res = await repost(lensConnected?.sessionClient!, {
        post: id,
      });

      if (res.isErr()) {
        setError?.(dict.Home.error);
        setInteractionLoading({
          ...interactionLoading,
          mirror: false,
        });

        return;
      }

      if (
        (res.value as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res.value as any)?.hash) {
        setInteractions?.({
          ...interactions,
          reposts: Number(post?.stats?.reposts) + 1,
          hasReposted: true,
        });
      } else {
        setError?.(dict.Home.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionLoading({
      ...interactionLoading,
      mirror: false,
    });
  };

  const handleComment = async () => {
    if (!post) return;
    setInteractionLoading({
      ...interactionLoading,
      comment: true,
    });
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
        setInteractionLoading({
          ...interactionLoading,
          comment: false,
        });
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
        } else {
          setError?.(dict.Home.error);
        }
      } else {
        setError?.(dict.Home.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionLoading({
      ...interactionLoading,
      comment: false,
    });
  };

  useEffect(() => {
    if (post) {
      setInteractions({
        hasReposted: post?.operations?.hasReposted?.optimistic!,
        upvotes: post?.stats?.upvotes,
        hasUpvoted: post?.operations?.hasUpvoted!,
        reposts: post?.stats?.reposts,
        hasCommented: post?.operations?.hasCommented?.optimistic!,
        comments: post?.stats?.comments,
      });
    }
  }, [post]);

  return {
    handleComment,
    handleMirror,
    handleLike,
    texto,
    setTexto,
    success,
    interactions,
    interactionLoading,
    commentOpen,
    setCommentOpen,
  };
};

export default useInteraccion;

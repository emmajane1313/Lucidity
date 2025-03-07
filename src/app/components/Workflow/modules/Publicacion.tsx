import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import Metadata from "./Metadata";
import { PublicacionProps } from "../types/workflow.types";
import moment from "moment";
import useInteraccion from "../hooks/useInteraccion";

const Publicacion: FunctionComponent<PublicacionProps> = ({
  activity,
  router,
  lensConnected,
  setError,
  setSignless,
  storageClient,
  post,
  dict,
}): JSX.Element => {
  const {
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
  } = useInteraccion(
    lensConnected,
    setError,
    setSignless,
    activity,
    storageClient,
    dict
  );
  return (
    <div
      className={`relative w-full gap-3 flex-col flex flex shadow-lg item-start p-2 h-fit justify-start`}
    >
      <div
        className={`relative w-full h-fit flex flex-row items-center gap-2 text-xxs ${
          activity?.commentOn?.id 
            ? "justify-between"
            : "justify-end"
        }`}
      >
        {activity?.commentOn?.id && (
          <div className="relative w-fit h-fit flex">
            {`${dict.Home.commentOn} ${(
              activity?.commentOn?.metadata as any
            )?.content?.slice(0, 10)}`}
          </div>
        )}
      </div>
      <div className="relative w-full h-fit px-1.5 py-1 flex items-start justify-between flex-row gap-2 sm:flex-nowrap flex-wrap">
        <div
          className="relative w-fit h-fit flex flex-row gap-1  items-center justify-center cursor-pointer"
          onClick={() => {
            router.push(`/creator/${activity?.author?.username?.localName}`);
          }}
        >
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full border border-windows bg-viol">
              <Image
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${
                  activity?.author?.metadata?.picture?.split("ipfs://")?.[1]
                }`}
              />
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center text-xs">
            {activity?.author?.username?.localName}
          </div>
        </div>
        <div className="relative w-fit h-fit flex text-xs">
          {moment(`${activity?.timestamp}`).fromNow()}
        </div>
      </div>
      <Metadata
        data={activity?.metadata as any}
        metadata={activity?.metadata?.__typename!}
      />
      <div
        className={`relative w-full h-fit p-1 rounded-md justify-between flex flex-row gap-3 items-center sm:flex-nowrap flex-wrap bg-black text-white border border-brillo`}
      >
        {[
          {
            name: dict.Home.like,
            function: () =>
              handleLike(
                activity?.id,
                activity?.operations?.hasUpvoted ? "DOWNVOTE" : "UPVOTE"
              ),
            svgFull: (
              <svg
                className="size-4"
                fill="#5aacfa"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9V2zm0 2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4h4z"
                  fill="#5aacfa"
                />{" "}
              </svg>
            ),
            svgEmpty: (
              <svg
                className="size-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9V2zm0 2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4h4z"
                  fill="currentColor"
                />{" "}
              </svg>
            ),
            stats: interactions?.upvotes,
            reacted: interactions.hasUpvoted,
            loader: interactionLoading?.like,
          },
          {
            name: dict.Home.mirror,
            function: () => handleMirror(activity?.id),
            reacted: interactions.hasReposted,
            svgFull: (
              <svg
                className="size-4"
                fill="#5aacfa"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M11 2H9v2H7v2H5v2H1v8h4v2h2v2h2v2h2V2zM7 18v-2H5v-2H3v-4h2V8h2V6h2v12H7zm6-8h2v4h-2v-4zm8-6h-2V2h-6v2h6v2h2v12h-2v2h-6v2h6v-2h2v-2h2V6h-2V4zm-2 4h-2V6h-4v2h4v8h-4v2h4v-2h2V8z"
                  fill="#5aacfa"
                />{" "}
              </svg>
            ),
            svgEmpty: (
              <svg
                className="size-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M11 2H9v2H7v2H5v2H1v8h4v2h2v2h2v2h2V2zM7 18v-2H5v-2H3v-4h2V8h2V6h2v12H7zm6-8h2v4h-2v-4zm8-6h-2V2h-6v2h6v2h2v12h-2v2h-6v2h6v-2h2v-2h2V6h-2V4zm-2 4h-2V6h-4v2h4v8h-4v2h4v-2h2V8z"
                  fill="currentColor"
                />{" "}
              </svg>
            ),
            stats: interactions?.reposts,
            loader: interactionLoading?.mirror,
          },
          !post && {
            name: dict.Home.comment,
            reacted: interactions?.hasCommented,
            function: () => setCommentOpen(!commentOpen),
            svgFull: (
              <svg
                className="size-4"
                fill="#5aacfa"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M22 2H2v14h2V4h16v12h-8v2h-2v2H8v-4H2v2h4v4h4v-2h2v-2h10V2z"
                  fill="#5aacfa"
                />{" "}
              </svg>
            ),
            svgEmpty: (
              <svg
                className="size-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  d="M22 2H2v14h2V4h16v12h-8v2h-2v2H8v-4H2v2h4v4h4v-2h2v-2h10V2z"
                  fill="currentColor"
                />{" "}
              </svg>
            ),
            stats: interactions?.comments,
            loader: interactionLoading.comment,
          },
        ]
          .filter(Boolean)
          .map((item: any, key) => {
            return (
              <div
                key={key}
                className="relative w-fit h-fit flex items-center justify-center flex-row gap-1"
                title={item.name}
              >
                <div
                  className={`relative w-fit h-fit flex ${
                    item?.loader ? "animate-spin" : "cursor-pointer"
                  }`}
                  onClick={() => !item?.loader && item.function()}
                >
                  {item?.loader ? (
                    <svg
                      fill="none"
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13 2h-2v6h2V2zm0 14h-2v6h2v-6zm9-5v2h-6v-2h6zM8 13v-2H2v2h6zm7-6h2v2h-2V7zm4-2h-2v2h2V5zM9 7H7v2h2V7zM5 5h2v2H5V5zm10 12h2v2h2v-2h-2v-2h-2v2zm-8 0v-2h2v2H7v2H5v-2h2z"
                        fill="currentColor"
                      />{" "}
                    </svg>
                  ) : item?.reacted ? (
                    item?.svgFull
                  ) : (
                    item?.svgEmpty
                  )}
                </div>
                <div className="text-xs relative w-fit h-fit flex items-center justify-center cursor-pointer">
                  {item?.stats || 0}
                </div>
              </div>
            );
          })}
      </div>
      {commentOpen && (
        <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
          <div className="relative w-fit h-fit flex">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="relative w-full h-28 flex items-start justify-start p-2 text-left text-sm focus:outline-none font-nerdS bg-black rounded-md text-white border border-brillo"
              style={{
                resize: "none",
              }}
            ></textarea>
          </div>
          <div
            className={`relative w-full h-full text-white font-nerdS rounded-md hover:opacity-80 bg-black border border-brillo text-center flex items-center justify-center ${
              !success && !interactionLoading.comment && texto?.trim() !== ""
                ? "cursor-pointer"
                : "opacity-70"
            }`}
            onClick={() =>
              !success &&
              !interactionLoading.comment &&
              texto?.trim() !== "" &&
              handleComment()
            }
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {success ? (
                "Success"
              ) : interactionLoading.comment ? (
                <svg
                  fill="none"
                  className="size-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 2h-2v6h2V2zm0 14h-2v6h2v-6zm9-5v2h-6v-2h6zM8 13v-2H2v2h6zm7-6h2v2h-2V7zm4-2h-2v2h2V5zM9 7H7v2h2V7zM5 5h2v2H5V5zm10 12h2v2h2v-2h-2v-2h-2v2zm-8 0v-2h2v2H7v2H5v-2h2z"
                    fill="white"
                  />{" "}
                </svg>
              ) : (
                dict.Home.comment
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicacion;

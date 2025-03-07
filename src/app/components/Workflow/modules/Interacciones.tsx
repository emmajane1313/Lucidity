import { FunctionComponent, JSX } from "react";
import { InteraccionesProps } from "../types/workflow.types";
import InfiniteScroll from "react-infinite-scroll-component";
import Publicacion from "./Publicacion";
import usePublicacion from "../hooks/usePublicacion";

const Interacciones: FunctionComponent<InteraccionesProps> = ({
  clienteLens,
  lensConectado,
  storageClient,
  setError,
  setSignless,
  flujo,
  router,
  dict,
}): JSX.Element => {
  const {
    handlePost,
    postLoading,
    texto,
    setTexto,
    success,
    post,
    comments,
    commentsLoading,
    hasMore,
    handleMoreComments,
    handleComment,
  } = usePublicacion(
    clienteLens,
    lensConectado,
    storageClient,
    setError,
    setSignless,
    flujo,
    dict
  );

  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-between gap-3">
      {post ? (
        <Publicacion
          storageClient={storageClient}
          lensConnected={lensConectado}
          router={router}
          activity={post}
          setError={setError}
          setSignless={setSignless}
          post
          dict={dict}
        />
      ) : (
        <div className="relative w-full h-fit flex">{dict.Home.thread}</div>
      )}
      <div className="relative w-full h-full overflow-y-scroll">
        <InfiniteScroll
          dataLength={comments?.length || 1}
          next={handleMoreComments}
          hasMore={hasMore?.hasMore}
          loader={<div key={0} />}
          className="relative w-full"
        >
          {commentsLoading ? (
            Array.from({ length: 10 }).map((_, indice) => {
              return (
                <div
                  key={indice}
                  className="relative w-full h-40 flex animate-pulse border border-brillo bg-black"
                ></div>
              );
            })
          ) : (
            <div
              className={`relative w-full font-nerdS flex flex-col items-start justify-start gap-3 h-fit h-full`}
            >
              {comments?.map((activity, indice) => {
                return (
                  <Publicacion
                    key={indice}
                    storageClient={storageClient}
                    lensConnected={lensConectado}
                    router={router}
                    activity={activity}
                    setError={setError}
                    setSignless={setSignless}
                    dict={dict}
                  />
                );
              })}
            </div>
          )}
        </InfiniteScroll>
      </div>
      <div className="relative w-full h-fit flex">
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
        className={`relative w-full h-fit text-white font-nerdS rounded-md hover:opacity-80 bg-black border border-brillo text-center flex items-center justify-center ${
          !success && !postLoading && texto?.trim() !== ""
            ? "cursor-pointer"
            : "opacity-70"
        }`}
        onClick={() =>
          !success && !postLoading && texto?.trim() !== "" && !post
            ? handlePost()
            : handleComment()
        }
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {success ? (
            "Success"
          ) : postLoading ? (
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
          ) : !post ? (
            dict.Home.start
          ) : (
            dict.Home.comment
          )}
        </div>
      </div>
    </div>
  );
};

export default Interacciones;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { db } from "@/firebase";
import {
  AdjustmentsVerticalIcon,
  ArrowDownTrayIcon,
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ModalItem from "../modal/Modal";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";

function PostElement({ data, docId, noIcons, replyId }) {
  const { data: session } = useSession();
  // don't populate the data unless we are on the main post not the reply
  const [postData, setPostData] = useState(replyId ? {} : data);
  const [likes, setLikes] = useState();
  const [replies, setReplies] = useState([]);
  const [timestamp, setTimestamp] = useState();
  const { postId } = useParams();
  const router = useRouter();

  // handling the modal of reply to the post/tweet
  const [openModal, setOpenModal] = useState(false);

  // handling the timestamp from firebase

  useEffect(() => {
    if (!data.timestamp) return;
    const { seconds, nanoseconds } = data.timestamp;
    setTimestamp(new Date(seconds * 1000 + nanoseconds / 1000000));
  }, [data]);

  // Create a JavaScript Date object using the extracted values

  // handle clicking on the post element
  const handleClick = () => {
    // check if we are on the post page or not
    if (postId || toUpdatePost) return;
    router.push(`${data.author.name.replaceAll(" ", "")}/status/${docId}`);
  };

  const fetchLikes = async () => {
    const postDoc = await getDoc(doc(db, "posts", docId));
    setPostData(postDoc.data());
    setLikes(postDoc.data().likes ? postDoc.data().likes.length : 0);
  };
  useEffect(() => {
    fetchLikes();
  }, [docId]);
  const likePostHandler = async () => {
    // add who liked to the same document inside likes array field
    fetchLikes();
    let likesFetched = postData.likes ?? [];
    // check if we liked it or not

    let likedOrNotLength = likesFetched.filter(
      (like) => like === session?.user?.email
    ).length;

    let likedOrNot = likedOrNotLength > 0 ? true : false;
    // if yes > remove our like
    if (likedOrNot) {
      setLikes(likesFetched.length - 1);
      let newArrayAfterRemoval = likesFetched.filter(
        (like) => like !== session?.user?.email
      );
      await updateDoc(doc(db, "posts", docId), {
        likes: [...newArrayAfterRemoval],
      });
    } else {
      // if no > add new like
      setLikes(likesFetched ? likesFetched.length + 1 : 1);
      await updateDoc(doc(db, "posts", docId), {
        likes: [...likesFetched, session?.user?.email],
      });
    }
  };

  // fetch replies
  useEffect(() => {
    if (!docId || postId) return;
    const fetchReplies = async () => {
      const repliesDocs = await getDocs(
        collection(db, "posts", docId, "replies")
      );
      setReplies(repliesDocs.docs);
    };
    fetchReplies();
  }, [docId, postId]);

  // edit post
  const [toUpdatePost, setToUpdatePost] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(data.content);
  const [loadingToUpdate, setLoadingToUpdate] = useState(false);
  const handleEditPost = async () => {
    setToUpdatePost(true);
  };
  const editPost = async () => {
    setLoadingToUpdate(true);
    await updateDoc(doc(db, "posts", docId), {
      content: updatedPost,
      timestamp: serverTimestamp(),
    });
    setPostData({ ...postData, content: updatedPost });
    setLoadingToUpdate(false);
    setToUpdatePost(false);
  };
  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", docId));
    router.push("/");
  };

  return (
    <div
      className={`w-full flex items-start justify-start px-4 pt-4 pb-2
    space-x-4 border-b border-[#161616] bg-transparent
     smooth ${!postId && "cursor-pointer hover:bg-[#0c0c0c]"} `}
    >
      <ModalItem
        open={openModal}
        setOpen={setOpenModal}
        data={data}
        postId={docId}
      />
      {/* image */}
      <span className="rounded-full self-start">
        <Image
          className="rounded-full"
          alt="user"
          width={40}
          height={40}
          src={data.author.image}
        />
      </span>
      {/* other */}
      <div className="w-full">
        <div onClick={handleClick}>
          {/* name/username/time */}
          <span
            className="w-full flex items-center justify-between 
          space-x-1 text-white self-center"
          >
            <span
              className="w-full flex items-center justify-start 
          space-x-1 text-white self-center"
            >
              <span
                className={`items-center justify-center ${
                  postId ? "flex flex-col space-y-1" : "flex space-x-2"
                }`}
              >
                <h3 className="font-bold">{data.author.name}</h3>
                <p className="opacity-60 text-sm">
                  @{data.author.name.replaceAll(" ", "")}
                </p>
              </span>
              {!postId && (
                <Link
                  href={`${data.author.name.replaceAll(
                    " ",
                    ""
                  )}/status/${docId}`}
                >
                  <p className="text-sm text-white/60 hover:underline smooth self-center">
                    <TimeAgo date={timestamp} />
                  </p>
                </Link>
              )}
            </span>
            <Dropdown className="bg-[#1d1d1d]">
              <DropdownTrigger>
                {/* icon dropdown */}
                <span className="cursor-pointer">
                  <EllipsisHorizontalIcon className="h-6 w-6" />
                </span>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  onClick={handleEditPost}
                  className="text-white"
                  key="edit"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={deletePost}
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
          {/* the content */}
          <div className="pt-4 pb-6 w-full">
            {toUpdatePost ? (
              <>
                <textarea
                  type="text"
                  value={updatedPost}
                  onChange={(e) => setUpdatedPost(e.target.value)}
                  placeholder="What is happening ?"
                  className="w-[90%] text-lg lg:text-xl py-6 px-4
               bg-transparent text-white min-h-[20vh]
            placeholder:text-white/40 outline-none"
                />
                <span className="w-full items-center justify-end flex">
                  <button
                    onClick={editPost}
                    className="post-button md:w-[6vw] py-2"
                  >
                    {loadingToUpdate ? <Spinner color="success" /> : "update"}
                  </button>
                </span>
              </>
            ) : (
              <>
                <h2 className="text-white/80 text-lg text-left">
                  {replyId ? data.content : postData.content}
                </h2>
                <div className="flex w-full mt-4">
                  {postData?.media?.length > 0 &&
                    postData?.media.map((image) => (
                      <Image
                        key={image}
                        src={image}
                        alt="temp-image"
                        height={500}
                        width={500}
                        className="rounded-lg"
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* icons */}
        {!noIcons && (
          <div className="flex items-center justify-between w-full">
            <span
              onClick={() => setOpenModal(true)}
              className="flex space-x-2 text-white/60 cursor-pointer
           hover:text-blue-400 group smooth"
            >
              <ChatBubbleOvalLeftIcon className="post-icon group-hover:stroke-blue-400" />
              <p className="text-sm ">{replies.length}</p>
            </span>

            <span
              className="flex space-x-2 text-white/60 cursor-pointer
           hover:text-green-400 group smooth"
            >
              <ArrowPathRoundedSquareIcon className="post-icon group-hover:stroke-green-400" />
              <p className="text-sm ">50</p>
            </span>

            {/* like icon */}
            <span
              onClick={likePostHandler}
              className="flex space-x-2 text-white/60 cursor-pointer
           hover:text-red-400 group smooth"
            >
              <HeartIcon
                className={`post-icon group-hover:stroke-red-400 
            ${
              postData?.likes?.filter((like) => like === session?.user?.email)
                .length > 0
                ? "stroke-red-400"
                : "stroke-white/60"
            } `}
              />
              <p
                className={`text-sm ${
                  postData?.likes?.filter(
                    (like) => like === session?.user?.email
                  ).length > 0
                    ? "text-red-400"
                    : "text-white/60"
                }`}
              >
                {likes}
              </p>
            </span>

            <span
              className="flex space-x-2 text-white/60 cursor-pointer
           hover:text-blue-400 group smooth"
            >
              <AdjustmentsVerticalIcon className="post-icon group-hover:stroke-blue-400" />
              <p className="text-sm ">50</p>
            </span>
            <span
              className="flex space-x-2 text-white/60 cursor-pointer
           hover:text-blue-400 group smooth"
            >
              <ArrowDownTrayIcon className="post-icon group-hover:stroke-blue-400 rotate-[180deg] " />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostElement;

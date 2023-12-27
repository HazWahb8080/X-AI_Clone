/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import PostElement from "@/components/postElement/PostElement";
import LeftSection from "@/components/sharedSections/LeftSection";
import MiddleSection from "@/components/sharedSections/MiddleSection";
import { db } from "@/firebase";
import { Spinner } from "@nextui-org/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function PostPage() {
  // fetch the post/tweet
  // get the id of the post from the url
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingToReply, setLoadingToReply] = useState(false);
  const [postExists, setPostExists] = useState(true);
  const [replies, setReplies] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      setLoading(true);
      const postData = await getDoc(doc(db, "posts", postId));
      if (postData.exists()) {
        setPostExists(true);
        setPost(postData.data());
        setLoading(false);
      } else {
        setPostExists(false);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // adding reply
  const addReply = async () => {
    if (reply.trim() == "" || !session) return;
    setLoadingToReply(true);
    await addDoc(collection(db, "posts", postId, "replies"), {
      content: reply,
      timestamp: serverTimestamp(),
      author: {
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      },
      media: [],
    });
    setLoadingToReply(false);
    setReply("");
  };
  // fetch replies
  useEffect(() => {
    if (!postId) return;

    onSnapshot(
      query(
        collection(db, "posts", postId, "replies"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          setReplies(snapshot.docs);
        } else {
          setReplies([]);
        }
      }
    );
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-black items-center justify-center flex min-h-screen">
        <Spinner color="white" />
      </div>
    );
  }

  return (
    <div className="main-body">
      <LeftSection />
      <MiddleSection>
        <h2 className="text-white text-lg md:text-xl px-4 font-bold py-6">
          post
        </h2>
        {!postExists && (
          <div className="w-full items-center justify-center flex h-full">
            <h3 className="text-white"> sorry! there is no post </h3>
          </div>
        )}
        {postExists && post.content && (
          <PostElement data={post} docId={postId} />
        )}
        {/* input for reply */}
        {post && (
          <div className="w-full border-b border-[#161616] pb-4">
            <span className="flex items-start justufy-start w-full pl-4 pt-4">
              <Image
                alt={session?.user?.name}
                src={session?.user?.image}
                className="rounded-full self-center"
                width={40}
                height={40}
              />
              <span>
                <p className="w-full text-left text-white/60 text-sm px-4 py-2">
                  replying to @{post?.author?.name}
                </p>
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={
                    post?.author?.email === session?.user?.email
                      ? "add another post"
                      : "post your reply"
                  }
                  className="w-full text-lg lg:text-xl py-6 px-4 bg-transparent text-white 
            placeholder:text-white/40 outline-none "
                />
              </span>
            </span>
            <span className="items-end justify-end flex pr-2">
              <button
                onClick={addReply}
                className="post-button md:w-[6vw] py-2"
              >
                {loadingToReply ? <Spinner color="success" /> : "Reply"}
              </button>
            </span>
          </div>
        )}
        {/* replies */}
        <div
          className="w-full item-start justify-start
         flex flex-col pb-10"
        >
          {replies.map((reply) => (
            <PostElement
              key={reply.id}
              docId={postId}
              replyId={reply.id}
              data={reply.data()}
            />
          ))}
        </div>
      </MiddleSection>
      {/* right */}
      <div className="col-span-1 "></div>
    </div>
  );
}

export default PostPage;

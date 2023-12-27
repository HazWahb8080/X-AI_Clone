"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import PostElement from "../postElement/PostElement";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";

function ModalItem({ open, setOpen, postId, data }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const addReply = async () => {
    if (reply.trim() == "" || !session) return;
    setLoading(true);
    await addDoc(collection(db, "posts", postId, "replies"), {
      content: reply,
      timestamp: serverTimestamp(),
      author: {
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      },
    });
    setLoading(false);
    setOpen(false);
    setReply("");
  };
  return (
    <Modal
      placement="top"
      backdrop="blur"
      isOpen={open}
      className="bg-[#080808] text-white"
      size="lg"
    >
      <ModalContent>
        <ModalBody>
          <PostElement data={data} docId={postId} noIcons={true} />
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={
              data.author.email === session?.user?.email
                ? "add another post"
                : "post your reply"
            }
            className="w-full text-lg lg:text-xl py-6 px-4 bg-transparent text-white 
            placeholder:text-white/40 outline-none "
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => setOpen(false)}>
            Close
          </Button>
          <button onClick={addReply} className="post-button w-[100px] py-1">
            {loading ? <Spinner size="sm" color="white" /> : "Post"}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalItem;

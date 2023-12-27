"use client";
import {
  BoltIcon,
  BoltSlashIcon,
  BriefcaseIcon,
  CogIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import PostElement from "@/components/postElement/PostElement";
import Image from "next/image";
import LeftSection from "@/components/sharedSections/LeftSection";
import { activeNavLinkAtom } from "./store";
import { useRecoilState } from "recoil";
import MiddleSection from "@/components/sharedSections/MiddleSection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendToOpenAI } from "@/actions/sendToOpenAI";

export const navLinks = [
  {
    id: 0,
    title: "home",
    link: "/home",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 1,
    title: "explore",
    link: "/explore",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 2,
    title: "notifications",
    link: "/notifications",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 3,
    title: "messages",
    link: "/messages",
    icon: <BriefcaseIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 4,
    title: "lists",
    link: "/lists",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 5,
    title: "communities",
    link: "/communities",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 6,
    title: "verified Orgs",
    link: "/verified-Orgs",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 7,
    title: "profile",
    link: "/profile",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
  {
    id: 8,
    title: "more",
    link: "/more",
    icon: <CogIcon className="h-8 w-8 stroke-white" />,
  },
];

export default function Home() {
  const [activeNavLink, setActiveNavLink] = useRecoilState(activeNavLinkAtom);
  const [activeTab, setactiveTab] = useState(0);
  const inputRef = useRef(null);

  const [activateAI, setActivateAI] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  // handling the tweet input

  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);

  // upload media to the post
  const [selectedImage, setSelectedImage] = useState({ image: "", url: "" });
  const handleMediaUpload = async (e) => {
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setSelectedImage({ image: e.target.files[0], url: imageUrl });
  };

  const addPost = async () => {
    if (post.trim() == "") return;
    if (!session) {
      router.push("/auth/signin");
    } else {
      setLoading(true);
      if (selectedImage.image) {
        // uploading the image to firebase storage
        const filename = `${session?.user?.email}_${Date.now()}_${
          selectedImage.image.name
        }`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, selectedImage.image);
        // after uploading we get the url
        const imageUrl = await getDownloadURL(storageRef);
        await addDoc(collection(db, "posts"), {
          content: post,
          timestamp: serverTimestamp(),
          author: {
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
            username: session?.user?.name,
          },
          media: [imageUrl],
        });
      } else {
        await addDoc(collection(db, "posts"), {
          content: post,
          timestamp: serverTimestamp(),
          author: {
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
            username: session?.user?.name,
          },
        });
      }
      setLoading(false);
      setPost("");
      setSelectedImage({ image: "", url: "" });
    }
  };

  const [posts, setPosts] = useState([]);

  // retreive posts
  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          setPosts(snapshot.docs);
        } else {
          setPosts([]);
        }
      }
    );
  }, []);

  // handling the ai feature
  const [loadingToAi, setLoadingToAi] = useState(false);
  const handleAIClick = async () => {
    setActivateAI((curr) => !curr);
  };
  const sendPrompt = async () => {
    if (prompt.trim() == "") return;
    setLoadingToAi(true);
    const result = await sendToOpenAI(prompt);
    setActivateAI(false);
    setPost(result);
    setLoadingToAi(false);
  };

  return (
    <main className="main-body relative">
      {/* left */}
      <LeftSection />
      {/* middle */}
      <MiddleSection>
        <h2 className="text-white text-lg md:text-xl px-4 font-bold py-6">
          {activeNavLink}
        </h2>
        <div
          className="items-center justify-center flex z-50
           bg-black backdrop-blur-md bg-opacity-20 border-b border-[#161616]
          space-x-4 w-full text-white text-lg sticky top-0"
        >
          <span
            onClick={() => setactiveTab(0)}
            className={`${activeTab === 0 ? "active-tab" : "tab"}`}
          >
            For You
          </span>
          <span
            onClick={() => setactiveTab(1)}
            className={`${activeTab === 1 ? "active-tab" : "tab"}`}
          >
            Following
          </span>
        </div>
        {/* the input */}
        <div
          className="border-y border-[#161616] py-2 w-full relative
         items-center justify-center flex flex-col"
        >
          {/* AI */}
          <button
            onClick={handleAIClick}
            className="text-white absolute top-2 right-2 z-50"
          >
            <BoltIcon className="stroke-yellow-500 animate-pulse h-6 w-6" />
          </button>

          {activateAI ? (
            <div
              className="w-[90%] py-4 rounded-lg bg-[#111111] 
            items-center justify-center flex mb-4 relative"
            >
              {loadingToAi ? (
                <Image
                  src="/loading.webp"
                  alt="loading"
                  height={100}
                  width={100}
                />
              ) : (
                <>
                  <textarea
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="write ..."
                    className="w-[90%] text-lg lg:text-xl py-6 
                    px-4 bg-transparent text-white 
                     placeholder:text-white/40 
                         outline-none"
                  />
                  <button
                    onClick={sendPrompt}
                    className="text-white absolute bottom-0 right-0 px-4 py-1
                    border border-white bg-black 
                    smooth hover:bg-white hover:text-black rounded-full"
                  >
                    send
                  </button>
                </>
              )}
            </div>
          ) : (
            <textarea
              type="text"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="What is happening ?"
              className="w-[90%] text-lg lg:text-xl py-6 px-4
               bg-transparent text-white min-h-[20vh]
            placeholder:text-white/40 outline-none"
            />
          )}
          {selectedImage.image && (
            <div
              className="px-5 py-2 rounded-xl w-full
            items-center justify-center"
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.image.name}
                height={500}
                width={500}
                className="self-center"
              />
            </div>
          )}

          {!activateAI && (
            <div className="items-center justify-between w-full flex px-4">
              {/* image input where we can upload media to post */}
              <span
                onClick={() => inputRef.current.click()}
                className="items-center justify-center flex"
              >
                <PhotoIcon className="h-6 w-6 cursor-pointer stroke-white" />
              </span>
              {/* hidden input for uploading the media */}
              <input
                hidden
                ref={inputRef}
                type="file"
                onChange={handleMediaUpload}
              />
              <button onClick={addPost} className="post-button md:w-[6vw] py-2">
                {loading ? <Spinner color="success" /> : "post"}
              </button>
            </div>
          )}
        </div>
        {/* list posts/tweets */}
        <div
          className="w-full item-start justify-start
         flex flex-col pb-10"
        >
          {posts.map((post) => (
            <PostElement key={post.id} docId={post.id} data={post.data()} />
          ))}
        </div>
      </MiddleSection>
      {/* right */}
      <div className="md:col-span-1 hidden md:flex"></div>
    </main>
  );
}

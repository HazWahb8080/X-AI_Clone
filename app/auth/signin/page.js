"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

function signin() {
  return (
    <div className="bg-black min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="w-full items-center flex justify-center">
        <svg
          className="h-[50%] w-[50%] stroke-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </div>
      <div className="w-full flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-bold"> Happening Now</h1>
        <h2 className="pb-12 pt-4 text-4xl">Join Today</h2>
        <button
          className="rounded-full bg-white text-black 
          flex space-x-2 text-lg px-10 py-2  hover:bg-transparent hover:text-white
           hover:border-white/50 border-transparent border
           transition duration-300 ease-in-out "
          onClick={() => signIn("google")}
        >
          <p>Signin with</p>
          <Image alt="google-logo" src="/google.png" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}

export default signin;

"use client";
import { navLinks } from "@/app/page";
import { activeNavLinkAtom } from "@/app/store";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

function LeftSection() {
  const [activeNavLink, setActiveNavLink] = useRecoilState(activeNavLinkAtom);

  return (
    <div
      className="md:col-span-1 h-full flex 
      flex-col items-start justify-start pt-2 md:px-10"
    >
      <span className="px-4 mb-4">
        <svg
          className="h-8 w-8 stroke-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </span>

      {navLinks.map((navLink) => (
        // <Link href={navLink.link} key={navLink.id}>
        <span
          onClick={() => setActiveNavLink(navLink.title)}
          key={navLink.id}
          className={`flex space-x-4 items-start justify-start text-white
             hover:bg-[#0f0f0f] rounded-full py-2 cursor-pointer px-4 ${
               activeNavLink === navLink.title ? "font-bold" : "font-normal"
             } `}
        >
          <>{navLink.icon}</>
          <p className="text-xl hidden md:flex ">{navLink.title}</p>
        </span>
        // </Link>
      ))}
      <span className="w-full items-center justify-center md:flex mt-4 hidden">
        <button className="post-button w-full">post</button>
      </span>
      {/* profile section */}
    </div>
  );
}

export default LeftSection;

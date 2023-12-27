"use client";
import { activeNavLinkAtom } from "@/app/store";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";

function MiddleSection({ children }) {
  return (
    <section className="md:col-span-2 border-x border-[#161616]">
      {children}
    </section>
  );
}

export default MiddleSection;

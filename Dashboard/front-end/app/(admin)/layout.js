"use client";

import React from "react";
import { Navbar } from "@/components";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f1f1f156]">
      <Navbar />
      <div className="ml-[70px] lg:ml-[18%] pt-[100px] pb-4 px-6">
        {children}
      </div>
    </div>
  );
}

export default Layout;

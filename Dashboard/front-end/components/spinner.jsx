"use client";

import { Spinner } from "@material-tailwind/react";

export default function CustomSpinner({ ...props }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0000000c]">
      <Spinner className={props.className} />
    </div>
  );
}

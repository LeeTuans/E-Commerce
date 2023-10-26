"use client";

import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

function DefaultPagination({ active, setActive, pageCount }) {
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
    className: "rounded-full",
  });

  const next = () => {
    if (active === 5) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={prev}
        disabled={active === 1}
      >
        <BsArrowLeft className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        {[...new Array(pageCount)].map((_, index) => (
          <IconButton {...getItemProps(index + 1)}>{index + 1}</IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={next}
        disabled={active === pageCount}
      >
        Next
        <BsArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default DefaultPagination;

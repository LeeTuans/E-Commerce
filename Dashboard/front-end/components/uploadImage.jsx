"use client";

import React, { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function UploadImage({ selectedImage, setSelectedImage, className = "" }) {
  const inputRef = useRef(null);

  const removeSelectedImage = () => {
    inputRef.current.value = null;
    setSelectedImage("");
  };

  return (
    <div
      className={
        className +
        " text-gray-600 relative flex flex-col items-center justify-center border-[3px] border-dashed border-gray-700 rounded-xl overflow-hidden"
      }
    >
      <FaCloudUploadAlt className="text-[4rem]" />
      <p>Choose image</p>

      {selectedImage && (
        <>
          <img
            src={
              typeof selectedImage === "string"
                ? selectedImage
                : URL.createObjectURL(selectedImage)
            }
            alt="Image"
            className="absolute z-[9] w-full h-full bg-gray-300 object-cover"
          />
          <button
            onClick={removeSelectedImage}
            type="button"
            className="absolute z-[11] bottom-2 right-2 p-2 rounded-full opacity-80 bg-red-300 text-white hover:bg-red-500 shadow-md transition-all"
          >
            <MdDeleteForever />
          </button>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          setSelectedImage(e.target.files[0]);
        }}
        className="opacity-0 z-[10] absolute w-full h-full cursor-pointer"
      />
    </div>
  );
}

export default UploadImage;

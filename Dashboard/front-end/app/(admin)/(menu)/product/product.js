"use client";

import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { selectProductById } from "@/redux/api/productApi";

function Product({ productId }) {
  const product = useSelector((state) => selectProductById(state, productId));

  return (
    product && (
      <div className="white-box rounded-md p-[5px] cursor-pointer hover:scale-[103%] transition-all">
        <img
          src={
            product?.image[0] ||
            "https://www.shopbase.com/blog/wp-content/uploads/2022/05/winning-product-la-gi-1-768x432.jpg"
          }
          alt="Sneaker"
          className="w-full h-[20vw] md:h-[16vw] lg:h-[11vw] xl:h-[9vw] rounded-md object-cover"
        />
        <div className="m-2 text-sm flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <p className="mr-2 font-semibold line-clamp-2">{product?.name}</p>
            <p className="px-2 py-1 text-xs bg-[#dee2fc] text-[#5864af] font-medium rounded-md">
              {product?.price}$
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[12px] w-fit">
              {product?.inventory.quantity} products |
            </p>
            <div className="ml-1 flex text-md text-yellow-600">
              {/* {[...new Array(5)].map((_, index) => {
                const rate =
                  product?.rating - 1 >= index
                    ? 100
                    : product?.rating > index
                    ? 50
                    : 0;

                return ( */}
              <div className=" relative">
                <div className={`absolute overflow-hidden w-[100%]`}>
                  <AiFillStar />
                </div>
                <div>
                  <AiOutlineStar />
                </div>
              </div>
              {/* );
              })} */}
              <div className="text-xs ml-1">{product?.rating}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Product;

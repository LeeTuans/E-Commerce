"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { AiFillStar } from "react-icons/ai";
import { TiArrowBack } from "react-icons/ti";

import { useGetProductsQuery } from "@/redux/api/productApi";
import ProductDialog from "../../productDialog";

function Page() {
  const { id } = useParams();
  const [dialog, setDialog] = useState({ open: false, type: "Create", id: "" });

  const { data, isLoading } = useGetProductsQuery({ id });

  const product = data ? { ...data.products.entities[id] } : undefined;

  const handleDialog = (type = "Update") => {
    setDialog({
      open: !dialog.open,
      type,
      id,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <Link href={`/product`}>
          <Button color="white" className="p-1 text-3xl">
            <TiArrowBack />
          </Button>
        </Link>

        <h1 className="head-title">Product Detail</h1>

        <div>
          <Button
            className="mr-3"
            color="blue"
            onClick={() => handleDialog("Edit")}
          >
            Update
          </Button>
          <Button color="red" onClick={() => handleDialog("Delete")}>
            Delete
          </Button>
        </div>

        {product && (
          <Card className="mt-3 w-full">
            <CardHeader floated={false} className="w-fit">
              <img
                src={
                  product?.image[0] ||
                  "https://www.shopbase.com/blog/wp-content/uploads/2022/05/winning-product-la-gi-1-768x432.jpg"
                }
                alt={product.name}
                className="w-96 h-56 object-cover"
              />
            </CardHeader>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-3">
                {product.name}
              </Typography>
              <div className="flex flex-col gap-2 mb-3">
                <Typography>Type: {product.category.name}</Typography>
                <Typography>Price: {product.price}$</Typography>
                <Typography className="flex items-center">
                  Rating: {product.rating}{" "}
                  <AiFillStar className="text-yellow-400 ml-1 text-lg" />
                </Typography>
                <Typography>Quantity: {product.inventory.quantity}</Typography>
              </div>
              <Typography>
                <div className="font-bold mb-1">Description:</div>
                {product.description || (
                  <i>"No description for this product."</i>
                )}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0"></CardFooter>
          </Card>
        )}
      </div>

      {/* Show Dialog */}
      {dialog.open && (
        <ProductDialog dialog={dialog} handleDialog={handleDialog} />
      )}
    </>
  );
}

export default Page;

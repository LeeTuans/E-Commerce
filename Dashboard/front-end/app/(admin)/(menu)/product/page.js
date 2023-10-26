"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { BiSolidAddToQueue } from "react-icons/bi";
import { Button, Input, Select, Option } from "@material-tailwind/react";

import { DefaultPagination } from "@/components";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "@/redux/api/productApi";
import Product from "./product";
import ProductDialog from "./productDialog";
import SelectCategory from "./selectCategory";

function Page() {
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [productParams, setProductParams] = useState({
    category: "",
    keyWord: "",
    sortColumn: "",
    sortType: "",
  });
  const [dialog, setDialog] = useState({ open: false, type: "Create", id: "" });
  const limit = 20;

  const { data, isFetching } = useGetProductsQuery(
    {
      ...productParams,
      page: active,
      limit: limit,
    },
    {
      pollingInterval: 5 * 60 * 1000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: categories, isLoading } = useGetCategoriesQuery();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setProductParams({
        ...productParams,
        keyWord: search,
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDialog = (type = "Create", id = "") => {
    setDialog({
      open: !dialog.open,
      type,
      id,
    });
  };

  const findByCategory = (value) => {
    setProductParams({
      ...productParams,
      category: value === "all" ? "" : value,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="head-title">Products</h1>

      <div className="flex gap-3 flex-col md:flex-row">
        <Button className="px-4 bg-gray-500 w-fit">Sort Price</Button>
        <div className="w-[250px]">
          <Input
            label="Search by title"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[150px]">
          {categories ? (
            <SelectCategory
              data={[{ _id: "all", name: "All" }, ...categories]}
              findByCategory={findByCategory}
            />
          ) : (
            <Select label="Category">
              <Option value="all">All</Option>
            </Select>
          )}
        </div>
      </div>

      <Button
        className="px-4 bg-blue-700 w-fit"
        onClick={() => handleDialog("Create")}
      >
        <div className="flex gap-3 items-center">
          <BiSolidAddToQueue className="text-xl" />
          <span>Add Product</span>
        </div>
      </Button>

      <div className="my-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4  2xl:grid-cols-5">
        {data &&
          data.products &&
          data.products.ids.map((id, index) => {
            return (
              <Link href={`/product/detail/${id}`}>
                <Product productId={id} />
              </Link>
            );
          })}
      </div>

      <div className="text-center text-gray-600">
        {!isFetching && (!data || data.count === 0) && (
          <i>No products found.</i>
        )}
      </div>

      {data && data.count > 0 && (
        <DefaultPagination
          active={active}
          setActive={setActive}
          pageCount={Math.ceil(data.count / limit)}
        />
      )}

      {/* Show Dialog */}
      {dialog.open && (
        <ProductDialog dialog={dialog} handleDialog={handleDialog} />
      )}
    </div>
  );
}

export default Page;

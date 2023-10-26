import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";

import { PiWarningBold } from "react-icons/pi";

import { useSelector } from "react-redux";
import { UploadImage } from "@/components";
import {
  selectProductById,
  useAddNewProductMutation,
  useDeleteproductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { useRouter } from "next/navigation";

function ProductDialog({ dialog, handleDialog }) {
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();

  const product = dialog.id
    ? useSelector((state) => selectProductById(state, dialog.id))
    : undefined;
  const { data: categories, isLoading } = useGetCategoriesQuery();

  // *** ACTION
  const [
    createProduct,
    { isLoading: createLoading, isSuccess: createSuccess },
  ] = useAddNewProductMutation();
  const [editProduct, { isLoading: editLoading, isSuccess: editSuccess }] =
    useUpdateProductMutation();
  const [
    deleteProduct,
    { isLoading: deleteLoading, isSuccess: deleteSuccess },
  ] = useDeleteproductMutation();

  // *** Set data (input,...)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return product
        ? {
            ...product,
            category: product.category._id,
            quantity: product.inventory.quantity,
          }
        : {};
    },
  });

  useEffect(() => {
    product?.image && setSelectedImage(product?.image[0]);
  }, [product]);

  /* **************************************************************** */
  const onSubmit = async (data) => {
    const form = new FormData();

    form.append("category", data.category);
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("price", data.price);
    form.append("quantity", data.quantity);
    form.append("upload", selectedImage);

    let response = null;

    switch (dialog.type) {
      case "Create":
        response = await createProduct(form);
        break;
      case "Edit":
        form.append("id", dialog.id);
        response = await editProduct(form);
        break;
      case "Delete":
        response = await deleteProduct(dialog.id);
        if (response.data) {
          router.push("/product");
        }
        break;
      default:
        break;
    }

    if (response && response.data) handleDialog();
  };

  /* **************************************************************** */
  let productDialog = <></>;

  if (dialog.type !== "Delete") {
    productDialog = (
      <div className="grid gap-6 text-black">
        {categories && (
          <Controller
            name="category"
            control={control}
            rules={{ required: "" }}
            render={({ field: { onChange, value } }) => (
              <Select label="Category" value={value} onChange={onChange}>
                {categories.map((item) => (
                  <Option value={item?._id}>{item?.name}</Option>
                ))}
              </Select>
            )}
            defaultValue={categories[0]?._id} // make sure to set up defaultValue
          />
        )}

        <Input label="Name" {...register("name")} />
        <Textarea label="Description" {...register("description")} />
        <Input label="Price ($)" {...register("price")} />
        <Input type="number" label="Inventory" {...register("quantity")} />

        <label>Image Preview:</label>
        <div className="flex justify-center">
          <UploadImage
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            className="w-[250px] h-[250px]"
          />
        </div>
      </div>
    );
  } else {
    productDialog = (
      <div className="flex items-center mx-4 my-2">
        <PiWarningBold className="text-[3rem] text-yellow-600 mr-4" />
        Are you sure want to delete this item?
      </div>
    );
  }

  return (
    <>
      <Dialog open={dialog.open} handler={() => handleDialog()}>
        <div className="max-h-[95vh] overflow-x-auto">
          <div className="flex items-center justify-between">
            <DialogHeader>{dialog.type} product</DialogHeader>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-3 h-5 w-5"
              onClick={() => handleDialog()}
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody divider>{productDialog}</DialogBody>
            <DialogFooter className="space-x-2">
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => handleDialog()}
              >
                close
              </Button>
              <Button
                type="submit"
                variant="gradient"
                color={dialog.type !== "Delete" ? "green" : "red"}
              >
                {dialog.type !== "Delete" ? "Save" : "Delete"}
                {(createLoading || editLoading || deleteLoading) && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline ml-2 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default ProductDialog;

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import { PiWarningBold } from "react-icons/pi";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  selectUserById,
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/redux/api/userApi";
import { UploadImage } from "@/components";

function UserDialog({ dialog, handleDialog }) {
  const [selectedImage, setSelectedImage] = useState("");

  const user = dialog.id
    ? useSelector((state) => selectUserById(state, dialog.id))
    : undefined;

  const [createUser, { isLoading: createLoading, isSuccess: createSuccess }] =
    useAddNewUserMutation();
  const [editUser, { isLoading: editLoading, isSuccess: editSuccess }] =
    useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess }] =
    useDeleteUserMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return user
        ? {
            ...user,
            city: user?.address?.city,
          }
        : {};
    },
  });

  const onSubmit = async (data) => {
    const form = new FormData();

    form.append("firstName", data.firstName);
    form.append("lastName", data.lastName);
    form.append("role", data.detailRole);
    form.append("detailRole", data.detailRole);
    form.append("phone", data.phone);
    form.append("city", data.city);
    form.append("upload", selectedImage);

    let response = null;

    switch (dialog.type) {
      case "Create": {
        form.append("userName", data.userName);
        form.append("password", data.password);

        response = await createUser(form);
        break;
      }
      case "Edit": {
        form.append("id", dialog.id);

        response = await editUser(form);
        break;
      }
      case "Delete": {
        response = await deleteUser(dialog.id);
        break;
      }
      default:
        break;
    }

    if (response && response.data) handleDialog();
  };

  useEffect(() => {
    user?.avatar && setSelectedImage(user?.avatar);
  }, [user]);

  let userDialog = <></>;

  if (dialog.type !== "Delete") {
    userDialog = (
      <div className="grid gap-6 text-black">
        {dialog.type === "Create" && (
          <>
            <Input label="Username" {...register("userName")} />
            <Input
              type="password"
              label="Password"
              autoComplete="true"
              {...register("password")}
            />
          </>
        )}

        <Input label="First name" {...register("firstName")} />
        <Input label="Last name" {...register("lastName")} />

        <Controller
          name="detailRole"
          control={control}
          rules={{ required: "" }}
          render={({ field: { onChange, value } }) => (
            <Select label="Role" value={value} onChange={onChange}>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
              <Option value="Other">Other</Option>
            </Select>
          )}
          defaultValue="" // make sure to set up defaultValue
        />

        <Input label="City" {...register("city")} />
        <Input label="Phone number" {...register("phone")} />

        <label>Avatar:</label>
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
    userDialog = (
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
            <DialogHeader>{dialog.type} user</DialogHeader>
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
            <DialogBody divider>{userDialog}</DialogBody>
            <DialogFooter className="space-x-2">
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => handleDialog()}
              >
                close
              </Button>
              <Button type="submit" variant="gradient" color="green">
                Save
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

export default UserDialog;

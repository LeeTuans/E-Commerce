"use client";

import { useEffect, useState } from "react";
import { BiSolidAddToQueue, BiSearchAlt } from "react-icons/bi";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";

import { DefaultPagination } from "@/components";
import { useGetUsersQuery } from "@/redux/api/userApi";
import User from "./user";
import UserDialog from "./userDialog";
import { Helpers } from "@/utils";

const TABLE_HEAD = [
  { name: "userName", title: "Member" },
  { name: "detailRole", title: "Function" },
  { name: "city", title: "City" },
  { name: "createdAt", title: "Created date" },
  { name: "", title: "" },
];

function Page() {
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [userParams, setUserParams] = useState({
    keyWord: "",
    sortColumn: "",
    sortType: "",
  });
  const [dialog, setDialog] = useState({ open: false, type: "Create", id: "" });
  const limit = 10;

  const { data, isFetching } = useGetUsersQuery(
    {
      ...userParams,
      page: active,
      limit: limit,
    },
    {
      pollingInterval: 5 * 60 * 1000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setUserParams({
        ...userParams,
        keyWord: search,
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    setActive(1);
  }, [userParams]);

  const handleDialog = (type = "Create", id = "") => {
    setDialog({
      open: !dialog.open,
      type,
      id,
    });
  };

  const handleViewAll = () => {
    setUserParams({
      keyWord: "",
      sortColumn: "",
      sortType: "",
    });
  };

  const handleSortHeader = (column) => {
    setUserParams({
      ...userParams,
      sortColumn: column,
      sortType: Helpers.handleSortType(
        userParams.sortColumn,
        userParams.sortType,
        column
      ),
    });
  };

  return (
    <>
      <h1 className="head-title">Users</h1>

      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="py-3 px-3 flex flex-col justify-between gap-4">
            <div className="flex gap-2 ">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => handleViewAll()}
              >
                view all
              </Button>
              <Button size="sm" onClick={() => handleDialog("Create")}>
                <div className="flex gap-3 items-center">
                  <BiSolidAddToQueue className="text-lg" />
                  <span>Add</span>
                </div>
              </Button>
            </div>
            <div className="w-72">
              <Input
                label="Search"
                icon={<BiSearchAlt className="h-5 w-5" />}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="my-2 p-0 overflow-auto">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map(({ name, title }, index) => (
                  <th
                    key={name}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    onClick={() => handleSortHeader(name)}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {title}{" "}
                      {userParams.sortType &&
                        name === userParams.sortColumn && (
                          <HiOutlineChevronUpDown className="h-4 w-4" />
                        )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.users &&
                data.users.ids.map((id, index) => {
                  return (
                    <tr key={index}>
                      <User userId={id} handleDialog={handleDialog} />
                    </tr>
                  );
                })}
              <tr className="text-center text-gray-600">
                {!isFetching && (!data || data.count === 0) && (
                  <i>No users found.</i>
                )}
              </tr>
            </tbody>
          </table>
        </CardBody>

        {data && data.count > 0 && (
          <DefaultPagination
            active={active}
            setActive={setActive}
            pageCount={Math.ceil(data.count / limit)}
          />
        )}
      </Card>

      {/* Show Dialog */}
      {dialog.open && (
        <UserDialog dialog={dialog} handleDialog={handleDialog} />
      )}
    </>
  );
}

export default Page;

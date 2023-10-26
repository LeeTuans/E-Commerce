"use client";

import React from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { selectUserById } from "@/redux/api/userApi";

import { BiEditAlt } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";

import {
  IconButton,
  Tooltip,
  Typography,
  Avatar,
} from "@material-tailwind/react";

function User({ userId, handleDialog }) {
  const user = useSelector((state) => selectUserById(state, userId));

  const date = user && moment(user.createdAt).format("MM/DD/YYYY");

  const classes = "p-4 border-b border-blue-gray-50";

  return (
    user && (
      <>
        <td className={classes}>
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              size="sm"
            />
            <div className="flex flex-col">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-70"
              >
                {user.userName}
              </Typography>
            </div>
          </div>
        </td>

        <td className={classes}>
          <div className="flex flex-col">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal uppercase"
            >
              {user.detailRole}
            </Typography>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal opacity-70"
            >
              {user.detailRole}
            </Typography>
          </div>
        </td>

        <td className={classes}>
          <Typography variant="small" color="blue-gray" className="font-normal">
            {user.address.city}
          </Typography>
        </td>

        <td className={classes}>
          <Typography variant="small" color="blue-gray" className="font-normal">
            {date}
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          {user.detailRole !== 'Admin' &&
            <>
              <Tooltip content="Edit User">
                <IconButton
                  variant="text"
                  color="blue"
                  onClick={() => handleDialog("Edit", user.id)}
                >
                  <BiEditAlt className="h-4 w-4" />
                </IconButton>
              </Tooltip>
              <Tooltip content="Delete User">
                <IconButton
                  variant="text"
                  color="red"
                  onClick={() => handleDialog("Delete", user.id)}
                >
                  <FiDelete className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            </>
        }
        </td>
      </>
    )
  );
}

export default User;

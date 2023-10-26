import bcrypt from "bcrypt";

import User from "../../mongodb/models/user/user.js";
import UserAddress from "../../mongodb/models/user/userAddress.js";
import { handleUpload } from "../../utils/cloudinary.js";
import UserPayment from "../../mongodb/models/user/userPayment.js";
import mongoose from "mongoose";

// @route GET /users
// @access Private
const getUsers = async (req, res) => {
  try {
    const { id, keyWord, sortColumn, sortType, page, limit } = req.query;

    // Find by Id or search with keyword (where in SQL)
    const dataFilters = {
      $and: [],
    };

    id && dataFilters.$and.push({ _id: new mongoose.Types.ObjectId(id) });
    keyWord &&
      (dataFilters.$or = [
        { userName: { $regex: ".*" + keyWord + ".*", $options: "i" } },
        { detailRole: { $regex: ".*" + keyWord + ".*", $options: "i" } },
        { firstName: { $regex: ".*" + keyWord + ".*", $options: "i" } },
        { lastName: { $regex: ".*" + keyWord + ".*", $options: "i" } },
      ]);

    !dataFilters.$and[0] && delete dataFilters.$and;

    // Sort, offser(skip), limit,...
    const sortField = !sortType // Non sort
      ? "detailRole"
      : sortColumn === "city" // Sort foreign field
      ? "address.city"
      : sortColumn || "detailRole";

    const options = [
      {
        $sort: {
          [sortField]: sortType === "desc" ? -1 : 1,
        },
      },
    ];
    page &&
      limit &&
      options.push({ $skip: Number((page - 1) * limit) }) &
        options.push({ $limit: Number(limit) });

    // *** Find data
    // const users = await User.find(dataFilters, columnsReturn, options)
    //   .populate("address payment")
    //   .select("-password")
    //   .lean();

    const users = await User.aggregate([
      { $match: dataFilters },
      {
        $lookup: {
          from: UserAddress.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "address",
        },
      },
      {
        $lookup: {
          from: UserPayment.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "payment",
        },
      },
      {
        $unwind: "$address",
      },
      ...options,
    ]);

    const count = await User.count(dataFilters);

    if (!users.length)
      return res.status(400).json({ message: "No users found" });

    return res.status(200).json({ users, count });
  } catch (err) {
    console.log(err);
  }
};

// @route POST /users
// @access Private
const createUser = async (req, res) => {
  try {
    const { ...data } = req.body;

    if (!data.userName || !data.password || !data.role)
      return res.status(400).json({ message: "Invalid fields" });

    // Check for duplicate userName
    const duplicate = await User.findOne({ userName: data.userName }).lean();

    if (duplicate)
      return res.status(409).json({ message: "Duplicate user name" });

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    // Upload image to cloudinary and get image url
    const imageUrl =
      data?.upload ||
      (!!req?.files?.lenght
        ? (await handleUpload(req.files[0], "products")).url
        : "");

    // Create a new user
    const newUser = await User.create({
      ...data,
      password: hashedPassword,
      avatar: imageUrl,
    });

    if (!newUser) return res.status(400).json({ message: "Invalid data" });

    data?.city &&
      (await UserAddress.create({ user: newUser._id, city: data?.city }));

    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
  }
};

// @route PUT /users
// @access Private
const updateUser = async (req, res) => {
  try {
    const { id, ...data } = req.body;

    const imageUrl =
      data?.upload ||
      (!!req?.files?.lenght
        ? (await handleUpload(req.files[0], "products")).url
        : "");

    const updatedUser = await User.findByIdAndUpdate(id, {
      ...data,
      avatar: imageUrl,
    });

    data?.city &&
      (await UserAddress.updateOne(
        { user: id },
        {
          city: data?.city,
        },
        { upsert: true }
      ));

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
  }
};

// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedUser = await User.deleteOne({ _id: id });

    return res.status(200).json({ message: "Delete user successfully" });
  } catch (err) {
    console.log(err);
  }
};

export { getUsers, createUser, updateUser, deleteUser };

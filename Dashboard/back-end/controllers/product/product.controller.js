import Product from "../../mongodb/models/product/product.js";
import ProductInventory from "../../mongodb/models/product/productInventory.js";
import ProductCategory from "../../mongodb/models/product/productCategory.js";
import Discount from "../../mongodb/models/product/discount.js";

import { randomCustom } from "../../utils/helpers.js";
import mongoose from "mongoose";

// @route GET /products
// @access Private
const getProducts = async (req, res) => {
  try {
    const { id, category, keyWord, sortColumn, sortType, page, limit } =
      req.query;

    // Find by Id or search with keyword (where in SQL)
    const dataFilters = {
      $and: [],
    };

    id && dataFilters.$and.push({ _id: new mongoose.Types.ObjectId(id) });
    category &&
      dataFilters.$and.push({
        category: new mongoose.Types.ObjectId(category),
      });
    keyWord &&
      (dataFilters.$or = [
        { name: { $regex: ".*" + keyWord + ".*", $options: "i" } },
        { description: { $regex: ".*" + keyWord + ".*", $options: "i" } },
      ]);

    !dataFilters.$and[0] && delete dataFilters.$and;

    // Sort, offser(skip), limit,...
    const options = [];

    sortType &&
      options.push({
        $sort: {
          [sortColumn]: sortType === "desc" ? -1 : 1,
        },
      });
    page &&
      limit &&
      options.push({ $skip: Number((page - 1) * limit) }) &
        options.push({ $limit: Number(limit) });

    // *** Find data
    // const products = await Product.find(dataFilters, columnsReturn, options)
    //   .populate("category inventory discount")
    //   .lean();

    const products = await Product.aggregate([
      { $match: dataFilters },
      {
        $lookup: {
          from: ProductCategory.collection.name,
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: ProductInventory.collection.name,
          localField: "_id",
          foreignField: "product",
          as: "inventory",
        },
      },
      {
        $lookup: {
          from: Discount.collection.name,
          localField: "_id",
          foreignField: "product",
          as: "discount",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $unwind: "$inventory",
      },
      ...options,
    ]);

    const count = await Product.count(dataFilters);

    return res.status(200).json({ products, count });
  } catch (err) {
    console.log(err);
  }
};

// @route POST /products
// @access Private
const createProduct = async (req, res) => {
  try {
    const { ...data } = req.body;

    if (!data.category || !data.name || !data.price || !data.quantity)
      return res.status(400).json({ message: "Invalid fields" });

    // Upload image to cloudinary and get image url
    const imageUrl =
      data?.upload ||
      (!!req?.files.lenght
        ? (await handleUpload(req.files[0], "products")).url
        : "");

    // Create a new product
    const newProduct = await Product.create({
      ...data,
      rating: randomCustom(2, 5, 1),
      image: [imageUrl],
    });

    if (!newProduct) return res.status(400).json({ message: "Invalid data" });

    data?.quantity &&
      (await ProductInventory.create({
        product: newProduct._id,
        quantity: data.quantity,
      }));

    data?.discount &&
      (await Discount.create({
        product: newProduct._id,
        name: data.discount.name,
        desc: data.discount.description,
        percent: data.discount.percent,
        active: data.discount.active,
      }));

    return res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
  }
};

// @route PUT /products
// @access Private
const updateProduct = async (req, res) => {
  try {
    const { id, ...data } = req.body;

    if (!id || !data.category || !data.name || !data.price || !data.quantity)
      return res.status(400).json({ message: "Invalid fields" });

    // Upload image to cloudinary and get image url
    const imageUrl =
      data?.upload ||
      (!!req?.files?.lenght
        ? (await handleUpload(req.files[0], "products")).url
        : "");

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      ...data,
      rating: randomCustom(2, 5, 1),
      image: [imageUrl],
    });

    data?.quantity &&
      (await ProductInventory.updateOne(
        { product: id },
        {
          quantity: data.quantity,
        },
        { upsert: true }
      ));

    data?.discount &&
      (await Discount.updateOne(
        { product: id },
        {
          name: data.discount.name,
          desc: data.discount.description,
          percent: data.discount.percent,
          active: data.discount.active,
        },
        { upsert: true }
      ));

    return res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
  }
};

// @route DELETE /products
// @access Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedProduct = await Product.deleteOne({ _id: id });

    return res.status(200).json({ message: "Delete product successfully" });
  } catch (err) {
    console.log(err);
  }
};

export { getProducts, createProduct, updateProduct, deleteProduct };

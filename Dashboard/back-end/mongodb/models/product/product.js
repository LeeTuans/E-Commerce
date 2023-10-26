import mongoose from "mongoose";
import Discount from "./discount.js";
import ProductInventory from "./productInventory.js";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Product_Categories" },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    image: [{ type: String }],
    rating: { type: Number },
  },
  { timestamps: true }
);

ProductSchema.virtual("inventory", {
  ref: "Product_Inventories",
  localField: "_id",
  foreignField: "product",
});

ProductSchema.virtual("discount", {
  ref: "Discounts",
  localField: "_id",
  foreignField: "product",
});

// On delete rows
ProductSchema.pre("deleteOne", async function (next) {
  await ProductInventory.deleteMany({ product: this._conditions._id });
  await Discount.deleteMany({ product: this._conditions._id });
  next();
});

const Product = mongoose.model("Products", ProductSchema);

export default Product;

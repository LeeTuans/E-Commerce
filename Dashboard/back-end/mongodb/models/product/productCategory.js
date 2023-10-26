import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductCategorySchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model(
  "Product_Categories",
  ProductCategorySchema
);

export default ProductCategory;

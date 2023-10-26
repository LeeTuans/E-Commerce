import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductInventorySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Products" },
    quantity: { type: Number },
  },
  { timestamps: true }
);

const ProductInventory = mongoose.model(
  "Product_Inventories",
  ProductInventorySchema
);

export default ProductInventory;

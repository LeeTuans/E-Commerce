import mongoose from "mongoose";
const { Schema } = mongoose;

const ShoppingSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    products: [{ type: Schema.Types.ObjectId, ref: "Products" }],
    total: { type: String },
  },
  { timestamps: true }
);

const ShoppingSession = mongoose.model(
  "Shopping_Session",
  ShoppingSessionSchema
);

export default ShoppingSession;

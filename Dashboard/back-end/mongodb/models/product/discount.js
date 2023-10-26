import mongoose from "mongoose";
const { Schema } = mongoose;

const DiscountSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Products" },
    name: { type: String },
    desc: { type: String },
    percent: { type: Number },
    active: { type: String },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discounts", DiscountSchema);

export default Discount;

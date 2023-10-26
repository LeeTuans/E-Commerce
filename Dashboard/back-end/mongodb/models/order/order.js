import mongoose from "mongoose";
import OrderItem from "./orderItem.js";
import OrderPayment from "./orderPayment.js";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    total: { type: String },
    status: { type: String },
  },
  { timestamps: true }
);

// *** Setup foreign keys
// Fields
OrderSchema.virtual("orderItems", {
  ref: "Order_Items",
  localField: "_id",
  foreignField: "order",
});

OrderSchema.virtual("payment", {
  ref: "Order_Payments",
  localField: "_id",
  foreignField: "order",
});

// On create rows
OrderSchema.pre("deleteOne", async function (next) {
  await OrderItem.deleteMany({ order: this._conditions._id });
  await OrderPayment.deleteMany({ order: this._conditions._id });
  next();
});

const Order = mongoose.model("Orders", OrderSchema);

export default Order;

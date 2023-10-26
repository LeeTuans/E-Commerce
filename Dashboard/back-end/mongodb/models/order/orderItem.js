import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Orders" },
    product: { type: Schema.Types.ObjectId, ref: "Products" },
    quantity: { type: String },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("Order_Items", OrderItemSchema);

export default OrderItem;

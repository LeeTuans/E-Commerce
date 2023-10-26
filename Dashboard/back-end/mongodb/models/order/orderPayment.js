import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderPaymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Orders" },
    paymentType: { type: String },
    accountNumber: { type: String },
    currency: { type: Schema.Types.Decimal128 },
    status: { type: String },
  },
  { timestamps: true }
);

const OrderPayment = mongoose.model("Order_Payments", OrderPaymentSchema);

export default OrderPayment;

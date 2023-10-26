import mongoose from "mongoose";
const { Schema } = mongoose;

const UserPaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    paymentType: { type: String },
    accountNumber: { type: String },
    other: { type: String },
  },
  { timestamps: true }
);

const UserPayment = mongoose.model("User_Payments", UserPaymentSchema);

export default UserPayment;

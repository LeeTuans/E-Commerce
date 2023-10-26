import mongoose from "mongoose";
import UserAddress from "./userAddress.js";
import UserPayment from "./userPayment.js";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: { type: String },
    password: { type: String },
    role: { type: String },
    detailRole: { type: String },
    avatar: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  },
  { timestamps: true }
);

// *** Setup foreign keys
// Fields
UserSchema.virtual("address", {
  ref: "User_Address",
  localField: "_id",
  foreignField: "user",
});

UserSchema.virtual("payment", {
  ref: "User_Payments",
  localField: "_id",
  foreignField: "user",
});

// On delete rows
UserSchema.pre("deleteOne", async function (next) {
  await UserAddress.deleteMany({ user: this._conditions._id });
  await UserPayment.deleteMany({ user: this._conditions._id });
  next();
});

const User = mongoose.model("Users", UserSchema);

export default User;

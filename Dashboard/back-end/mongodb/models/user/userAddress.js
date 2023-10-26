import mongoose from "mongoose";
const { Schema } = mongoose;

const UserAddressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const UserAddress = mongoose.model("User_Address", UserAddressSchema);

export default UserAddress;

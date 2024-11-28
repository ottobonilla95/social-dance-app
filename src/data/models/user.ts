import { User as UserType } from "@/src/types";
import mongoose, { Schema, Model } from "mongoose";

const UserSchema: Schema<UserType> = new Schema({
  name: { type: String, required: true },
  bioDescription: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  xUrl: { type: String, required: false },
  instagramUrl: { type: String, required: false },
  linkedinUrl: { type: String, required: false },
  cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
});

const User: Model<UserType> =
  mongoose.models.User || mongoose.model<UserType>("User", UserSchema);

export default User;

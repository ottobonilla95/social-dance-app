import mongoose, { Schema, Model } from "mongoose";
import { DanceStyleType } from "@/src/types";

const DanceStyleSchema: Schema<DanceStyleType> = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  iconUrl: { type: String, required: false },
});

const DanceStyle: Model<DanceStyleType> =
  mongoose.models.DanceStyle ||
  mongoose.model<DanceStyleType>("DanceStyle", DanceStyleSchema);

export default DanceStyle;

import { City as CityType } from "@/src/types";
import mongoose, { Schema, Model } from "mongoose";

const CitySchema: Schema<CityType> = new Schema({
  name: { type: String, required: true },
  countryId: { type: Schema.Types.ObjectId, ref: "Country", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const City: Model<CityType> =
  mongoose.models.City || mongoose.model<CityType>("City", CitySchema);

export default City;

import { Country as CountryType } from "@/src/types";
import mongoose, { Schema, Model } from "mongoose";

const CountrySchema: Schema<CountryType> = new Schema({
  name: { type: String, required: true },
});

const Country: Model<CountryType> =
  mongoose.models.Country ||
  mongoose.model<CountryType>("Country", CountrySchema);

export default Country;

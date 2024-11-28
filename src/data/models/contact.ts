import { Contact as ContactType } from "@/src/types";
import mongoose, { Schema, Model } from "mongoose";

const ContactSchema: Schema<ContactType> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  linkedin: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Contact: Model<ContactType> =
  mongoose.models.Contact ||
  mongoose.model<ContactType>("Contact", ContactSchema);

export default Contact;

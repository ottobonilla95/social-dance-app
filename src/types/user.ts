import { ObjectId } from "mongoose";
import { Currency } from "./currency";
import { DanceStyleType } from "./dance-style";

export type User = {
  id?: string;
  name: string;
  bioDescription: string;
  email?: string;
  lastUpdated: string;
  password?: string;
  xUrl?: Currency;
  linkedinUrl?: Currency;
  instagramUrl?: Currency;
  cityId?: ObjectId;
  tourFinished?: boolean;
  subscriptionPlan?: string;
  subscriptionCancelAt?: number;
  stripeId?: string;
  subscriptionId?: string;
  profileUrl: string;
  dateOfBirth: Date;
  profilePicture: string;
  spotifySongId?: string;
  styles: {
    styleId: ObjectId | DanceStyleType;
    level: number;
  }[];
};

import { Currency } from "./currency";

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
  cityId?: string;
  tourFinished?: boolean;
  subscriptionPlan?: string;
  subscriptionCancelAt?: number;
  stripeId?: string;
  subscriptionId?: string;
};

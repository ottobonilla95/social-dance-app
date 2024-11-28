"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { FormMessage } from "../types";
import { z } from "zod";
import User from "../data/models/user";
import CIty from "../data/models/city";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";
import { SubscriptionPlan } from "../ui/pricing";

export type AuthFormState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CreateUserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
} & FormMessage;

export type UpdatePasswordFormState = {
  errors?: {
    currentPassword?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: {
    text?: string;
    type?: string;
  };
};

const createSchema = (dict: AppDictionary) =>
  z
    .object({
      name: z
        .string({
          invalid_type_error: dict.api.shared.requiredField,
        })
        .min(1, { message: dict.api.shared.requiredField })
        .refine((value) => value.trim().length > 0, {
          message: dict.api.shared.requiredField,
        }),
      email: z
        .string({
          invalid_type_error: dict.api.shared.requiredField,
        })
        .email({ message: dict.api.shared.invalidEmail })
        .min(1, { message: dict.api.shared.requiredField })
        .refine((value) => value.trim().length > 0, {
          message: dict.api.shared.requiredField,
        }),

      password: z
        .string({
          invalid_type_error: dict.api.shared.requiredField,
        })
        .min(6, { message: dict.api.shared.passwordShouldHaveAtLeast6Chars }),
      passwordConfirmation: z.string({
        invalid_type_error: dict.api.shared.requiredField,
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: dict.api.shared.passwordsDontMatch,
      path: ["passwordConfirmation"],
    });

const createUpdatePasswordFormSchema = (dict: AppDictionary) =>
  z
    .object({
      currentPassword: z.string({
        invalid_type_error: dict.api.shared.requiredField,
      }),
      password: z
        .string({
          invalid_type_error: dict.api.shared.requiredField,
        })
        .min(6, { message: dict.api.shared.passwordShouldHaveAtLeast6Chars }),
      passwordConfirmation: z.string({
        invalid_type_error: dict.api.shared.requiredField,
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: dict.api.shared.passwordsDontMatch,
      path: ["passwordConfirmation"],
    });

export async function authenticate(
  lang: AvailableLanguages,
  prevState: string | undefined,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return dict.api.auth.invalidCredentials;
        default:
          return dict.api.shared.somethingWentWrong;
      }
    }
    throw error;
  }
}

export async function createUser(
  lang: AvailableLanguages,
  plan: SubscriptionPlan,
  paymentLink: string | undefined,
  prevState: CreateUserFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const CreateUser = createSchema(dict);
  const isFreePlan = plan === "free";

  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.user.create.error,
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { name, password, email } = validatedFields.data;
  let userCreatedId;

  try {
    await connectDB();

    const city = await CIty.findOne({
      name: "Madrid",
    });


    const user = await User.findOne({
      email,
    });

    if (user) {
      return {
        message: {
          text: dict.api.user.create.alreadyExists,
          type: "error",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // const city = await CIty.findOne({
    //   name: "Madrid",
    // });

    console.log(city)
    console.log(city)
    console.log(city)
    console.log(city)
    console.log(city)

    const userCreted = await User.create({
      email,
      name,
      password: hashedPassword,
      lang,
      cityId: city?._id,
      lastUpdated: new Date(),
      bioDescription: "",
    });

    userCreatedId = userCreted._id;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    throw error;
  }

  if (isFreePlan) {
    redirect(`/${lang}/dashboard`);
  } else {
    const paymentUrl = `${paymentLink}?client_reference_id=${userCreatedId}&prefilled_email=${email}&locale=${lang}`;

    redirect(paymentUrl);
  }
}

export async function updatePassword(
  lang: AvailableLanguages,
  prevState: UpdatePasswordFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const UpdatePasswordFormSchema = createUpdatePasswordFormSchema(dict);

  // Validate form using Zod
  const validatedFields = UpdatePasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.password.update.error,
        type: "error",
      },
    };
  }

  const { currentPassword, password } = validatedFields.data;

  try {
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return {
        errors: {},
        message: {
          text: dict.api.password.update.userNotFound,
          type: "error",
        },
      };
    }

    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      user.password as string
    );

    if (!passwordsMatch) {
      return {
        errors: {},
        message: {
          text: dict.api.password.update.invalidPassword,
          type: "error",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      {
        _id: userId,
      },
      {
        password: hashedPassword,
      }
    );
  } catch (error) {
    return {
      message: {
        text: dict.api.password.update.error,
        type: "error",
      },
    };
  }

  return {
    message: {
      text: dict.api.password.update.success,
      type: "success",
    },
  };
}

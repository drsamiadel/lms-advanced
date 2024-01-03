"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

export const updateProfile = async (values: {
  name: string;
  email: string;
  country: string;
  birthdate: Date;
}) => {
  try {
    const { id } = await userSession();
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: values.name,
        email: values.email,
        userInfo: {
          upsert: {
            create: {
              country: values.country,
              birthdate: values.birthdate,
            },
            update: {
              country: values.country,
              birthdate: values.birthdate,
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

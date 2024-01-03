"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";

export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  if (!email || !password || !name) return;

  const checkUser = await prisma.user.findUnique({ where: { email } });

  if (checkUser)
    throw new Error("This email is already registered. Please try to login.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return user;
}

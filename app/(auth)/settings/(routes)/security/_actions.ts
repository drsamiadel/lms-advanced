"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";

export const updatePassword = async (values: {
  oldPassword: string;
  newPassword: string;
}) => {
  const { id } = await userSession();
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User has no password");
  const isValid = bcrypt.compare(values.oldPassword, user.password);
  if (!isValid) throw new Error("Invalid password");
  const password = await bcrypt.hash(values.newPassword, 10);
  await prisma.user.update({ where: { id }, data: { password } });
  return user;
};

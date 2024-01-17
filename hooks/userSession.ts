import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db/prisma";
import { User, UserInfo } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type UserSession = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string[];
};

export const userSession = async (): Promise<UserSession> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/signin");
    const { user } = session;
    return user;
  } catch (error) {
    console.log(error);
    redirect("/signin");
  }
};

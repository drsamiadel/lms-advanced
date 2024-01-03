import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type UserRole = {
  id?: string | null;
  role?: string[];
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/signin");

    const { user } = session;

    const getRole = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            role: true,
            id: true
        }
    })

    return {
      id: getRole?.id,
      role: getRole?.role,
    };
  } catch (error) {
    console.log(error);
    return {
      id: null,
      role: [],
    };
  }
};

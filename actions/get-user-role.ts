import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

type UserRole = {
  id?: string | null;
  role?: string[];
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const { id } = await userSession();

    const getRole = await prisma.user.findUnique({
        where: {
            id
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

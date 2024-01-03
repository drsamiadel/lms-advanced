import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";
import { User, UserInfo } from "@prisma/client";

type FullUser =
  | (User & {
      userInfo: UserInfo | null;
    })
  | null;

export const getUser = async (): Promise<FullUser> => {
  try {
    const { id } = await userSession();
    const getUser = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        userInfo: true,
      },
    });
    return getUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

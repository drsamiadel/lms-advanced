import { getServerSession } from "next-auth";
import Image from "next/image";
import { userSession } from "@/hooks/userSession";

export default async function Avatar() {
  const { image, name} = await userSession();
  return (
    <Image
      src={image || "/assets/Avatar.svg"}
      alt={name || "User Image"}
      width={40}
      height={40}
      className="rounded-full"
    />
  );
}

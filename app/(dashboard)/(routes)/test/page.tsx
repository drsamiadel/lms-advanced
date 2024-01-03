import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}

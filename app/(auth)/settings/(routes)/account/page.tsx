import { userSession } from "@/hooks/userSession";
import AccountItem from "./_components/account-item";
import { prisma } from "@/lib/db/prisma";

export default async function AccountPage() {
  const { id } = await userSession();
  const accounts = await prisma.account.findMany({
    where: {
      userId: id,
    },
  });
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-slate-800 font-[500]">Account settings</h2>
      <div className="flex flex-col gap-y-2 mt-8">
        <h3 className="text-slate-700 font-[500] text-sm">Linked accounts</h3>
        <div className="flex flex-col gap-y-2 mt-2">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountItem key={account.id} provider={account.provider} />
            ))
          ) : (
            <span className="text-slate-600">No accounts linked</span>
          )}
        </div>
      </div>
    </div>
  );
}

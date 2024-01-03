import Image from "next/image";

interface AccountItemProps {
  provider: string;
}

const providers = [
  {
    name: "Google",
    icon: "/icons/google.svg",
  },
];

export default function AccountItem({ provider }: AccountItemProps) {
  const providerData = providers.find((p) => p.name.toLowerCase() === provider.toLowerCase());
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-x-2">
        {providerData && (
          <Image
            src={providerData.icon}
            alt={`${providerData.name} icon`}
            width={24}
            height={24}
          />
        )}
        <span className="text-slate-800 font-[500]">{providerData?.name}</span>
      </div>
      {/* <button className="text-slate-800 font-[500] text-sm">
        Unlink
      </button> 
      coming soon
      */}
    </div>
  );
}

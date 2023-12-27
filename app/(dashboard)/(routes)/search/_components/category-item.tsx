import { cn } from "@/lib/utils"
import {IconType} from "react-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"

type CategoryItemProps = {
    label: string
    icon?: IconType
    value?: string
}

export default function CategoryItem({
    label,
    icon: Icon,
    value
}: CategoryItemProps) {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathName,
            query: {
                categoryId: isSelected ? null : value,
                title: currentTitle
            }
        }, {skipNull: true, skipEmptyString: true})
        router.push(url);
    }
  return (
    <button className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
        )} type="button" onClick={onClick}>
        {Icon && <Icon size={20} />}
        <div className="truncate">{label}</div>
    </button>
  )
}
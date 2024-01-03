"use client";

import { Category } from "@prisma/client";
import {
  FcElectronics,
  FcHeadset,
  FcSettings,
  FcEngineering,
  FcDatabase,
  FcTreeStructure,
  FcSelfServiceKiosk,
  FcTwoSmartphones,
  FcCommandLine,
  FcReddit,
  FcGlobe,
  FcConferenceCall,
  FcMindMap,
  FcFolder,
  FcRadarPlot,
  FcLink,
  FcCrystalOscillator,
  FcPaid,
  FcGallery,
} from "react-icons/fc";

import { IconType } from "react-icons";
import CategoryItem from "./category-item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type CategoriesProps = {
  items: Category[];
};

const iconMap: Record<Category["name"], IconType> = {
  "Programming Languages": FcCommandLine,
  "Web Development": FcSelfServiceKiosk,
  "Mobile App Development": FcTwoSmartphones,
  "Data Science": FcTreeStructure,
  "Machine Learning": FcElectronics,
  "Artificial Intelligence": FcReddit,
  "Network Administration": FcGlobe,
  "Database Management": FcDatabase,
  "Game Development": FcHeadset,
  "Software Engineering": FcSettings,
  "Operating Systems": FcEngineering,
  "Computer Hardware": FcElectronics,
  "Digital Marketing": FcConferenceCall,
  "Computer Graphics": FcMindMap,
  "IT Project Management": FcFolder,
  "Computer Networks": FcRadarPlot,
  "Cloud Computing": FcLink,
  "Cypersecurity": FcCrystalOscillator,
  "E-commerce": FcPaid,
  "UX/UI Design": FcGallery,
};

export default function Categories({ items }: CategoriesProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 py-4">
        {items.map((item) => (
          <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

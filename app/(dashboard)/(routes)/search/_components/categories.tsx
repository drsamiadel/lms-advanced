"use client";

import { Category } from '@prisma/client';
import {
    FaCode,
    FaTv,
    FaMobileScreen,
    FaDatabase,
    FaRobot,
    FaLayerGroup,
    FaMask,
    FaNetworkWired,
    FaServer,
    FaGamepad,
    FaPeopleGroup,
    FaWindows,
    FaRegHardDrive,
    FaRegIdBadge
} from "react-icons/fa6"

import {IconType} from "react-icons"
import CategoryItem from './category-item';

type CategoriesProps = {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Programming Languages": FaCode,
    "Web Development": FaTv,
    "Mobile App Development": FaMobileScreen,
    "Data Science": FaDatabase,
    "Machine Learning": FaRobot,
    "Artificial Intelligence": FaLayerGroup,
    "Cyper Security": FaMask,
    "Network Administration": FaNetworkWired,
    "Database Management": FaServer,
    "Game Development": FaGamepad,
    "Software Engineering": FaPeopleGroup,
    "Operating Systems": FaWindows,
    "Computer Hardware": FaRegHardDrive,
    "Digital Marketing": FaRegIdBadge,
    "Computer Graphics": FaTv,
    "E-Commerce": FaTv,
    "IT Project Management": FaPeopleGroup,
    "Computer Networks": FaNetworkWired,
}

export default function Categories({
    items
}: CategoriesProps) {
  return (
    <div className='flex items-center gap-2 flex-wrap pb-2'>
        {items.map((item) => (
            <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
        ))}
    </div>
  )
}
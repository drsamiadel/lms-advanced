"use client"

import { Bell, CreditCard, Fingerprint, User2, UserRoundCog } from 'lucide-react';
import React from 'react'
import SettingSidebarRoute from './setting-sidebar-route';


const routes = [
  {
    label: "Profile",
    href: "/settings/profile",
    icon: User2,
  },
  {
    label: "Account",
    href: "/settings/account",
    icon: UserRoundCog,
  },
  {
    label: "Security",
    href: "/settings/security",
    icon: Fingerprint,
  },
  {
    label: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
];

//"Profile", "Account", "Security", "Billing", "Notifications"
export default function SettingSidebarRoutes() {
  return (
    <div className='space-y-1'>
      {routes.map((route, index) => (
        <SettingSidebarRoute key={index} label={route.label} href={route.href} icon={route.icon} />
      ))}
    </div>
  )
}

'use client';

import { Home, MapPin, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/quests", icon: Home, label: "Home" },
  { href: "/browse-lost", icon: Search, label: "Lost" },
  { href: "/browse-found", icon: MapPin, label: "Found" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-medieval-brown border-t-4 border-medieval-gold shadow-2xl">
      <div className="container mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-4 transition-all duration-200 flex-1",
                  isActive ? "nav-item-active" : "nav-item"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-medieval-gold" : "text-medieval-beige/70"
                )} />
                <span className={cn(
                  "text-xs font-semibold",
                  isActive ? "text-medieval-gold" : "text-medieval-beige/70"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

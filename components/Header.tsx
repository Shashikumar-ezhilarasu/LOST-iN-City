'use client';

import { Coins, Home, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-medieval-brown border-b-4 border-medieval-gold shadow-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-medieval-gold" />
          <h1 className="fantasy-title text-xl md:text-2xl">
            Lost-City
          </h1>
        </div>

        {/* Right: Stats and Profile */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Gold Coins */}
          <div className="flex items-center space-x-2 bg-medieval-brown-light px-3 py-2 rounded-lg gold-border">
            <Coins className="w-5 h-5 text-medieval-gold" />
            <span className="text-medieval-gold font-bold text-sm md:text-base">
              12,000
            </span>
          </div>

          {/* Level */}
          <div className="bg-medieval-gold text-medieval-brown px-3 py-2 rounded-lg font-bold text-sm md:text-base border-2 border-medieval-gold-dark shadow-lg">
            LEVEL 1
          </div>

          {/* User Avatar */}
          <Link href="/profile">
            <Avatar className="w-10 h-10 cursor-pointer hover:border-medieval-gold transition-all">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Player" />
              <AvatarFallback className="bg-medieval-gold text-medieval-brown">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}

'use client';

import { Coins, Home, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-medieval-brown border-b-4 border-medieval-gold shadow-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-medieval-gold" />
          <Link href="/">
            <h1 className="fantasy-title text-xl md:text-2xl cursor-pointer hover:text-medieval-gold-light transition-colors">
              Lost-City
            </h1>
          </Link>
        </div>

        {/* Right: Stats and Profile or Sign In */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {!isLoaded ? (
            <div className="text-medieval-gold">Loading...</div>
          ) : isSignedIn ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              {/* Gold Coins */}
              <div className="flex items-center space-x-2 bg-medieval-brown-light px-3 py-2 rounded-lg gold-border">
                <Coins className="w-5 h-5 text-medieval-gold" />
                <span className="text-medieval-gold font-bold text-sm md:text-base">
                  {(user?.publicMetadata?.coins as number) || 0}
                </span>
              </div>

              {/* Level */}
              <div className="hidden sm:block bg-medieval-gold text-medieval-brown px-3 py-2 rounded-lg font-bold text-sm md:text-base border-2 border-medieval-gold-dark shadow-lg">
                LEVEL {(user?.publicMetadata?.level as number) || 1}
              </div>

              {/* User Avatar */}
              <Link href="/profile">
                <Avatar className="w-10 h-10 cursor-pointer hover:border-medieval-gold transition-all ring-2 ring-transparent hover:ring-medieval-gold">
                  <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-medieval-gold text-medieval-brown">
                    {user?.firstName?.[0] || <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button 
                  variant="outline" 
                  className="border-medieval-gold text-medieval-gold hover:bg-medieval-gold hover:text-medieval-brown transition-all"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-medieval-gold text-medieval-brown hover:bg-medieval-gold-light font-bold shadow-lg">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
